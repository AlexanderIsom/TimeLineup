"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
	const supabase = createClient();
	const { data } = await supabase.from("notification").select("*, event(*), profile(*)");
	return data;
}

export async function markNoticiationAsRead(id: string) {
	const supabase = createClient();
	await supabase.from("notification").delete().eq("id", id);
	revalidatePath("/");
}

export type NotificationQuery = Awaited<ReturnType<typeof getNotifications>> | undefined;
