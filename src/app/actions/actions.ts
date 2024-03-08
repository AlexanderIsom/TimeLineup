'use server'
import { Schedule } from "@/components/events/ClientCardContainer";
import { db } from "@/db";
import { events, rsvps } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";

export interface rsvpData {
	eventId: number;
	schedules: Array<Schedule>
	rejected: boolean;
	rsvpId?: number;
}

export async function createRSVP(data: rsvpData) {
	const user = await currentUser();
	await db.insert(rsvps).values({
		id: data.rsvpId,
		userId: user!.id,
		eventId: data.eventId,
		schedules: data.schedules,
		rejected: data.rejected
	}).onConflictDoUpdate({ target: rsvps.id, set: { schedules: data.schedules, rejected: data.rejected } }).execute();
}

export interface newEventData {
	userId: string;
	title: string;
	start: Date;
	end: Date;
	description?: string;
	invitedUsers: Array<string>;
}

export async function createEvent(data: newEventData) {
	await db.insert(events).values({
		userId: data.userId,
		title: data.title,
		start: new Date(data.start),
		end: new Date(data.end),
		description: data.description,
		invitedUsers: data.invitedUsers
	});
}