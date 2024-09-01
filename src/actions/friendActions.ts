"use server";
import { db } from "@/db";
import { Profile, friendships, profiles } from "@/db/schema";
import { WithoutArray } from "@/utils/TypeUtils";
import { createClient } from "@/lib/supabase/server";
import { and, eq, ilike, ne, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { User } from "@supabase/supabase-js";

export async function addFriendById(id: string) {
	const user = (await getUser()) as User;

	const pendingRequest = await db.query.friendships.findFirst({
		where: or(
			and(eq(friendships.sending_user, user.id), eq(friendships.receiving_user, id)),
			and(eq(friendships.sending_user, id), eq(friendships.receiving_user, user.id)),
		),
	});

	if (pendingRequest !== undefined) {
		if (pendingRequest.status === "pending") {
			acceptFriendRequest(id);
		}
		return;
	}

	await db.insert(friendships).values({
		sending_user: user.id,
		receiving_user: id,
	});

	revalidatePath("/", "layout");
}

export async function addFriendByName(username: string) {
	const user = await getUser();
	const supabase = createClient();
	const { data: targetUser } = await supabase
		.from("profile")
		.select("*")
		.ilike("username", username.toLowerCase())
		.single();

	if (!targetUser || user!.id === targetUser.id) {
		const message = user?.id === targetUser?.id ? "You cannot add yourself" : "Could not find username";
		return { success: false, error: message };
	}

	return await addFriendById(targetUser.id);
}

export interface friendRequest {
	id: string;
	profile: Profile;
}

export async function acceptFriendRequest(id: string) {
	await db.update(friendships).set({ status: "accepted" }).where(eq(friendships.id, id));
	revalidatePath("/");
}

export async function removeFriend(id: string) {
	await db.delete(friendships).where(eq(friendships.id, id));
	revalidatePath("/");
}

export async function getFriendshipsWithStatus() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const queryResult = await db
		.select({
			id: friendships.id,
			status: friendships.status,
			incoming: sql<boolean>`friendship.receiving_user = ${user.id}`,
			profile: { ...profiles },
		})
		.from(friendships)
		.innerJoin(
			profiles,
			or(
				and(ne(friendships.sending_user, user.id), eq(friendships.sending_user, profiles.id)),
				and(ne(friendships.receiving_user, user.id), eq(friendships.receiving_user, profiles.id)),
			),
		)
		.where(or(eq(friendships.sending_user, user.id), eq(friendships.receiving_user, user.id)));

	return queryResult;
}

export async function getFriends() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const queryResult = await db
		.select({
			profile: { ...profiles },
		})
		.from(friendships)
		.innerJoin(
			profiles,
			or(
				and(ne(friendships.sending_user, user.id), eq(friendships.sending_user, profiles.id)),
				and(ne(friendships.receiving_user, user.id), eq(friendships.receiving_user, profiles.id)),
			),
		)
		.where(
			and(
				or(eq(friendships.sending_user, user.id), eq(friendships.receiving_user, user.id)),
				eq(friendships.status, "accepted"),
			),
		);

	return queryResult.map((result) => result.profile);
}

export type FriendStatusAndProfiles = Awaited<ReturnType<typeof getFriendshipsWithStatus>>;
export type FriendStatusAndProfile = WithoutArray<FriendStatusAndProfiles>;
