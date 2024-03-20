'use server'
import { db } from "@/db";
import { friendshipStatus, friendships, profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, eq, exists, or } from "drizzle-orm";

export async function addFriend(formData: FormData) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;
	const targetFriend = await db.query.profiles.findFirst({
		where: eq(profiles.username, formData.get('username') as string)
	})

	if (targetFriend === undefined || user.id === targetFriend.id) {
		return;
	}

	const areFriends = await db.query.friendships.findFirst({
		where: or(and(eq(friendships.user_1, user.id), eq(friendships.user_2, targetFriend.id)), and(eq(friendships.user_1, targetFriend.id), eq(friendships.user_2, user.id)))
	})

	if (areFriends !== undefined) {
		if (areFriends.status === "pending") {
			acceptFriendRequest(targetFriend.id)
		}
		return;
	}

	await db.insert(friendships).values({
		user_1: user.id,
		user_2: targetFriend.id
	});
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

	const query = db.select().from(friendships).where(and(eq(friendships.user_1, user.id), eq(friendships.status, "pending")))

	const users = await db.query.profiles.findMany({
		where: exists(query)
	})

	return users.filter(u => u.id !== user.id)
}

export async function getIncomingRequests() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const query = db.select().from(friendships).where(and(eq(friendships.user_2, user.id), eq(friendships.status, "pending")))

	const users = await db.query.profiles.findMany({
		where: exists(query)
	})

	return users.filter(u => u.id !== user.id)
}

export async function acceptFriendRequest(id: string) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	await db.update(friendships)
		.set({ status: "accepted" })
		.where(and(eq(friendships.user_1, id), eq(friendships.user_2, user.id)));
}

export async function getFriends() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const query = db.select().from(friendships).where(and(or(eq(friendships.user_1, user.id), eq(friendships.user_2, user.id)), eq(friendships.status, "accepted")))

	const users = await db.query.profiles.findMany({
		where: exists(query)
	})

	return users.filter(u => u.id !== user.id)
}