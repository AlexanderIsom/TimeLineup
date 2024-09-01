"use server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getCurrentProfile } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function isUsernameAvaliable(usernameQuery: string) {
	const { profile, user: localUser } = await getCurrentProfile();

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
	const { profile, user: localUser } = await getCurrentProfile();
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
