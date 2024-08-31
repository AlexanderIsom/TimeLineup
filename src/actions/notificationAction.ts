"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}

	const user = data.user;

	const queryNotifications = await db.query.notifications.findMany({
		where: eq(notifications.target, user.id),
		with: { event: true, sender: true },
	});

	return queryNotifications;
}

export async function markNoticiationAsRead(id: string) {
	await db.update(notifications).set({ seen: true }).where(eq(notifications.id, id));

	revalidatePath("/");
}

export type NotificationQuery = Awaited<ReturnType<typeof getNotifications>> | undefined;
