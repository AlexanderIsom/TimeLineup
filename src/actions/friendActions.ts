"use server"
import { db } from "@/db";
import { Profile, friendships, profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, eq, ilike, ne, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addFriend(usernameQuery: string) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;
	const targetFriend = await db.query.profiles.findFirst({
		where: ilike(profiles.username, usernameQuery!.toLowerCase())
	})

	if (targetFriend === undefined || user.id === targetFriend.id) {
		return { success: false, error: "Could not find username" };
	}

	const pendingRequest = await db.query.friendships.findFirst({
		where:
			or(
				and(
					eq(friendships.sending_user, user.id),
					eq(friendships.receiving_user, targetFriend.id)
				),
				and(
					eq(friendships.sending_user, targetFriend.id),
					eq(friendships.receiving_user, user.id)
				)
			)
	})

	if (pendingRequest !== undefined) {
		if (pendingRequest.status === "pending") {
			acceptFriendRequest(targetFriend.id)
		}
		return;
	}

	await db.insert(friendships).values({
		sending_user: user.id,
		receiving_user: targetFriend.id
	});

	revalidatePath("/")
	return { success: true }
}

export async function getUser() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	return await db.query.profiles.findFirst({
		where: eq(profiles.id, user.id)
	})
}

export interface friendRequest {
	id: string
	profile: Profile
}

export async function acceptFriendRequest(id: string) {
	await db.update(friendships)
		.set({ status: "accepted" })
		.where(eq(friendships.id, id));

	revalidatePath("/")
}

export async function removeFriend(id: string) {
	await db.delete(friendships).where(eq(friendships.id, id))

	revalidatePath("/")
}

export async function getFriends() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const queryResult = await db
		.select({
			id: friendships.id,
			status: friendships.status,
			incoming: sql<boolean>`friendship.receiving_user = ${user.id}`,
			profile: { ...profiles }
		}).from(friendships)
		.innerJoin(profiles,
			or(
				and(
					ne(friendships.sending_user, user.id),
					eq(friendships.sending_user, profiles.id)
				)
				,
				and(
					ne(friendships.receiving_user, user.id),
					eq(friendships.receiving_user, profiles.id)
				)
			))
		.where(or(
			eq(friendships.sending_user, user.id),
			eq(friendships.receiving_user, user.id)
		));

	return queryResult
}

export type FriendStatusAndProfile = Awaited<ReturnType<typeof getFriends>> | undefined

