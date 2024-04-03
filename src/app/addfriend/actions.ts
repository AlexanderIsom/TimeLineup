"use server"
import { db } from "@/db";
import { Profile, friendships, profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
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
		return;
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

export async function getOutgoingRequests() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const query = db.select().from(friendships).where(and(eq(friendships.sending_user, user.id), eq(friendships.status, "pending")))

	const users = await db.query.profiles.findMany({
		where: exists(query)
	})

	return users.filter(u => u.id !== user.id)
}

export interface friendRequest {
	id: string
	profile: Profile
}

export async function getIncomingRequests() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;
	// const query = db.select().from(friendships).where(and(eq(friendships.receiving_user, user.id), eq(friendships.status, "pending")))

	// const users = await db.query.profiles.findMany({
	// 	where: exists(query),
	// })

	const friendRequests: Array<friendRequest> = [];

	const query = await db.query.friendships.findMany({
		where: and(eq(friendships.receiving_user, user.id), eq(friendships.status, "pending")),
		with: { sendingUser: true }
	})

	query.forEach(q => {
		const newRequest: friendRequest = { id: q.id, profile: q.sendingUser }
		friendRequests.push(newRequest);
	})

	return friendRequests
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

	// const query = db.select().from(friendships).where(and(or(eq(friendships.sending_user, user.id), eq(friendships.receiving_user, user.id)), eq(friendships.status, "accepted")))

	// const users = await db.query.profiles.findMany({
	// 	where: exists(query)
	// }).then((values) => { return values.filter(u => u.id !== user.id) })

	const userId = user.id

	const queryResult = await db
		.select({
			id: friendships.id,
			status: friendships.status,
			profile: {
				username: profiles.username,
				id: profiles.id,
				avatarUrl: profiles.avatarUrl
			}
		}).from(friendships).innerJoin(profiles, sql`(
			friendship.sending_user != ${userId}
			AND friendship.sending_user = profile.id
		  ) OR (
			friendship.receiving_user != ${userId}
			AND friendship.receiving_user = profile.id
		  )`)
		.where(sql`friendship.sending_user = ${userId} OR friendship.receiving_user = ${userId}`);

	return queryResult
}

export type getFriendsType = Awaited<ReturnType<typeof getFriends>> | undefined



