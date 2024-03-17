'use server'
import { Schedule } from "@/components/events/ClientCardContainer";
import { db } from "@/db";
import { rsvps } from "@/db/schema";

export interface rsvpData {
	eventId: number;
	schedules: Array<Schedule>
	rejected: boolean;
	rsvpId?: number;
}

export async function saveRsvp(data: rsvpData) {

	await db.insert(rsvps).values({
		id: data.rsvpId,
		userId: "user!.id",
		eventId: data.eventId,
		schedules: data.schedules,
		rejected: data.rejected
	}).onConflictDoUpdate({ target: rsvps.id, set: { schedules: data.schedules, rejected: data.rejected } }).execute();
}