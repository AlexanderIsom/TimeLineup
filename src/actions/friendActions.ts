"use server";
import { getUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addFriendById(id: string) {
	const user = await getUser();
	if (!user) return;

	const supabase = createClient();

	const { data: pendingRequest } = await supabase
		.from("friendship")
		.select("*")
		.or(`receving_user.eq.${id}, sending_user.eq.${id}`)
		.maybeSingle();

	if (pendingRequest !== null) {
		if (pendingRequest.status === "pending") {
			acceptFriendRequest(id);
		}
		return;
	}

	await supabase.from("friendship").insert({
		sending_user: user.id,
		receiving_user: id,
	});

	await supabase.from("notification").insert({
		event_id: null,
		sender: user.id,
		target: id,
		type: "friend",
	});

	revalidatePath("/", "layout");
}

export async function addFriendByName(username: string) {
	const user = await getUser();
	if (!user) return { success: false, error: "you are not logged in" };

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

	await addFriendById(targetUser.id);
	return { success: true, message: "" };
}

export async function acceptFriendRequest(id: string) {
	const supabase = createClient();
	await supabase.from("friendship").update({ status: "accepted" }).eq("id", id);
	revalidatePath("/");
}

export async function removeFriend(id: string) {
	const supabase = createClient();
	await supabase.from("friendship").delete().eq("id", id);
	revalidatePath("/");
}
