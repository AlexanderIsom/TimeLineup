"use server";
import { getCurrentProfile } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function isUsernameAvaliable(usernameQuery: string) {
	const supabase = createClient();
	const { profile, user: localUser } = await getCurrentProfile();

	if (usernameQuery.length === 0 || profile?.username === usernameQuery) {
		return false;
	}

	if (usernameQuery) {
		const { data: user } = await supabase
			.from("profile")
			.select()
			.ilike("username", `%${usernameQuery}%`)
			.maybeSingle();

		if (user === undefined) {
			return true;
		} else {
			return user?.id === localUser?.id;
		}
	}
}

export async function updateUserProfile(values: { username?: string; avatarUrl?: string }) {
	const supabase = createClient();
	const { profile, user: localUser } = await getCurrentProfile();
	await supabase.from("profile").update(values).eq("id", localUser!.id);
}

export async function deleteUserProfile() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		console.log("Deleting user profile");
		await supabase.auth.signOut();
		await supabase.from("profile").delete().eq("id", user.id);
		revalidatePath("/", "layout");
		redirect("/");
	}
}
