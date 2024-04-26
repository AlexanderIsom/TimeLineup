'use server'
import { TimeSegment } from "@/components/events/ClientCardContainer";
import { db } from "@/db";
import { InsertRsvp, RsvpStatus, rsvpStatus, rsvps } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveRsvp(rsvp: InsertRsvp) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}
	const user = data.user;

	if (!user) return;

	rsvp.userId = user.id

	await db.insert(rsvps).values(rsvp).onConflictDoUpdate({ target: rsvps.id, set: { schedules: rsvp.schedules, status: rsvp.status } }).execute();
}

export async function updateRsvpStatus(eventId: string, status: RsvpStatus) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}
	const user = data.user;

	if (!user) return;

	await db.update(rsvps).set({ status: status }).where(and(eq(rsvps.eventId, eventId), eq(rsvps.userId, user.id)))
	revalidatePath('/');
}