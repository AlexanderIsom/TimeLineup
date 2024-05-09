'use server'
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq, ilike } from "drizzle-orm";

export async function getUserProfile() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return
	}

	const user = await db.query.profiles.findFirst({
		where: eq(profiles.id, data.user.id)
	})

	if (user === undefined) {
		return
	}

	return user;
}

export async function isUsernameAvaliable(usernameQuery: string) {
	const localUser = await getUserProfile();

	if (usernameQuery) {
		const user = await db.query.profiles.findFirst({
			where: ilike(profiles.username, usernameQuery!.toLowerCase())
		})

		if (user === undefined) {
			return true
		} else {
			return user?.id === localUser?.id
		}
	}
}

export async function updateUserProfile(values: {
	username?: string;
	avatarUrl?: string;
}) {
	const localUser = await getUserProfile();
	await db.update(profiles).set(values).where(eq(profiles.id, localUser!.id))
}

export async function deleteProfile() {
	const localUser = await getUserProfile();
	await db.delete(profiles).where(eq(profiles.id, localUser!.id))
}