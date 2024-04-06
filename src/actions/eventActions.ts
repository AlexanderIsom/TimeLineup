'use server'
import { db } from "@/db";
import { InsertNotification, Profile, events, notificationType, notifications, profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { arrayOverlaps, eq, inArray, or } from "drizzle-orm";

export interface newEventData {
	title: string;
	start: Date;
	end: Date;
	description?: string;
	invitedUsers: Array<string>;
}

export async function createEvent(eventData: newEventData) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const newEvent = await db.insert(events).values({
		userId: data.user.id,
		title: eventData.title,
		start: new Date(eventData.start),
		end: new Date(eventData.end),
		description: eventData.description,
		invitedUsers: eventData.invitedUsers
	}).returning();

	const notificationsToCreate: Array<InsertNotification> = [];

	eventData.invitedUsers.forEach(userString => {
		notificationsToCreate.push({
			type: "event",
			message: "you have been invited to an event",
			seen: false,
			target: userString,
			sender: data.user.id,
			event: newEvent[0].id
		})
	});

	if (notificationsToCreate.length > 0) {
		await db.insert(notifications).values(notificationsToCreate);
	}


	return newEvent[0].id
}

export async function GetLocalUserEvents() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const query = await db.query.events.findMany({
		where: or(eq(events.userId, data.user.id), arrayOverlaps(events.invitedUsers, [data.user.id]))
	});

	return query;
}

export async function GetEventData(eventId: string) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const eventData = await db.query.events.findFirst({
		where: eq(events.id, eventId),
		with: {
			rsvps: {
				with: { user: true }
			},
			host: true
		},
	});


	if (eventData === undefined) {
		Error("could not find event data");
	}

	if (eventData === undefined) {
		return;
	}

	if (data.user.id !== eventData.host.id && !eventData.invitedUsers.includes(data.user.id)) {
		return;
	}


	let attendees: Array<Profile> = [];
	if (eventData?.invitedUsers !== undefined && eventData.invitedUsers.length > 0) {
		attendees = await db.query.profiles.findMany({
			where: inArray(profiles.id, eventData?.invitedUsers)
		})
	}

	return { data: eventData, attendees: attendees }
}

export type EventDataQuery = Awaited<ReturnType<typeof GetEventData>> | undefined