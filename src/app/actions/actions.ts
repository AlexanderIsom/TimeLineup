'use server'
import { Schedule } from "@/components/events/ClientCardContainer";
import { db } from "@/db";
import { events, rsvps } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { assert } from "console";

export interface newRsvpData {
	eventId: number;
	schedules: Array<Schedule>
	rejected: boolean;
}

export async function createRSVP(data: newRsvpData) {
	const user = await currentUser();
	assert(user)
	await db.insert(rsvps).values({
		userId: user!.id,
		eventId: data.eventId,
		schedules: data.schedules,
		rejected: data.rejected
	});
}

export async function updateRSVP() {

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