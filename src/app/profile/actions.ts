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

export async function updateUserProfile(_currentState: unknown, formData: FormData) {
	const localUser = await getUserProfile();
	const usernameQuery = formData.get("username") as string
	const urlQuery = formData.get("url") as string
	console.log("BLAC" + urlQuery);
	let update;
	if (usernameQuery !== null && usernameQuery !== "") {
		const user = await db.query.profiles.findFirst({
			where: ilike(profiles.username, usernameQuery!.toLowerCase())
		})

		if (user !== undefined && user?.id !== localUser?.id) {
			return 'Username is taken'
		}

		if (update === undefined) {
			update = {};
		}

		update = { ...update, username: usernameQuery }
	}

	if (urlQuery !== null) {
		if (update === undefined) {
			update = {};
		}

		update = { ...update, avatarUrl: urlQuery }
	}

	if (update !== undefined) {
		console.log(update);
		await db.update(profiles).set(update).where(eq(profiles.id, localUser!.id))
	}
}