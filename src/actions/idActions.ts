'use server'
import { Schedule } from "@/components/events/ClientCardContainer";
import { db } from "@/db";
import { rsvps } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

export interface rsvpData {
	eventId: string;
	schedules: Array<Schedule>
	rejected: boolean;
	rsvpId?: string;
}

export async function saveRsvp(rsvpData: rsvpData) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}
	const user = data.user;

	await db.insert(rsvps).values({
		id: rsvpData.rsvpId,
		userId: user.id,
		eventId: rsvpData.eventId,
		schedules: rsvpData.schedules,
		rejected: rsvpData.rejected
	}).onConflictDoUpdate({ target: rsvps.id, set: { schedules: rsvpData.schedules, rejected: rsvpData.rejected } }).execute();
}