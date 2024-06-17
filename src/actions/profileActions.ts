"use server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserProfile() {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) {
		redirect("/error");
	}

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, user.id),
	});

	if (!profile) {
		redirect("/error");
	}

	return profile;
}

export async function isUsernameAvaliable(usernameQuery: string) {
	const localUser = await getUserProfile();

	if (usernameQuery) {
		const user = await db.query.profiles.findFirst({
			where: ilike(profiles.username, usernameQuery!.toLowerCase()),
		});

		if (user === undefined) {
			return true;
		} else {
			return user?.id === localUser?.id;
		}
	}
}

export async function updateUserProfile(values: { username?: string; avatarUrl?: string }) {
	const localUser = await getUserProfile();
	await db.update(profiles).set(values).where(eq(profiles.id, localUser!.id));
}

export async function deleteUserProfile() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		console.log("Deleting user profile");
		await supabase.auth.signOut();
		await db.delete(profiles).where(eq(profiles.id, user.id));
		revalidatePath("/", "layout");
		redirect("/");
	}
}
