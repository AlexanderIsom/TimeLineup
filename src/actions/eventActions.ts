'use server'
import { db } from "@/db";
import { Event, InsertEvent, InsertNotification, InsertRsvp, Profile, events, notificationType, notifications, profiles, rsvps } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, arrayOverlaps, eq, getTableColumns, inArray, or } from "drizzle-orm";

export async function createEvent(eventData: InsertEvent, invitedUsers: Array<Profile>) {
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
	}).returning();

	const notificationsToCreate: Array<InsertNotification> = [];
	const rsvpsToCreate: Array<InsertRsvp> = [];

	invitedUsers.forEach(user => {
		notificationsToCreate.push({
			type: "event",
			message: "you have been invited to an event",
			target: user.id,
			sender: data.user.id,
			event: newEvent[0].id
		})

		rsvpsToCreate.push({
			eventId: newEvent[0].id,
			userId: user.id,
		})
	});

	if (notificationsToCreate.length > 0) {
		await db.insert(notifications).values(notificationsToCreate);
	}

	if (rsvpsToCreate.length > 0) {
		await db.insert(rsvps).values(rsvpsToCreate);
	}

	return newEvent[0].id
}

export async function UpdateEvent(eventData: Event, invitedUsers: Array<Profile>) {
	//
}

export async function GetLocalUserEvents() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const sq = db.select({ event_id: rsvps.eventId }).from(rsvps).where(and(eq(rsvps.userId, data.user.id)));

	const query = await db.query.events.findMany({
		where: or(eq(events.userId, data.user.id), eq(sq, events.id))
	})

	return query;
}

export async function GetEventData(eventId: string) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const sq = db.select({ event_id: rsvps.eventId }).from(rsvps).where(and(eq(rsvps.userId, data.user.id)));

	const eventData = await db.query.events.findFirst({
		where:
			and(
				eq(events.id, eventId),
				or(
					eq(events.userId, data.user.id),
					eq(sq, eventId)
				)
			),
		with: {
			rsvps: {
				with: { user: true }
			},
			host: true
		},
	});

	return eventData
}

export type EventDataQuery = Awaited<ReturnType<typeof GetEventData>> | undefined