"use server";

import { db } from "@/db";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const notifications = await supabase.from("notification").select("*, event(*), profile(*)");
	return notifications;
}

export async function markNoticiationAsRead(id: string) {
	const supabase = createClient();
	await supabase.from("notification").update({ seen: true }).eq("id", id);
	revalidatePath("/");
}

export type NotificationQuery = Awaited<ReturnType<typeof getNotifications>> | undefined;
