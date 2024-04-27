'use server'
import { db } from "@/db";
import { InsertEvent, InsertNotification, InsertRsvp, Profile, events, notifications, rsvps, timeSegments } from "@/db/schema";
import { NotUndefined } from "@/utils/TypeUtils";
import { createClient } from "@/utils/supabase/server";
import { isWithinInterval } from "date-fns";
import { and, eq, inArray, or } from "drizzle-orm";

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

export async function UpdateEvent(eventData: NotUndefined<EventDataQuery>, invitedUsers: Array<Profile>) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return;
	}

	const rsvpsToRemove = eventData.rsvps.filter(rsvp => !invitedUsers.find(user => user.id === rsvp.userId))
	const newInvitees = invitedUsers.filter(user => !eventData.rsvps.find(rsvp => rsvp.userId === user.id))

	const notificationsToCreate: Array<InsertNotification> = [];
	const rsvpsToCreate: Array<InsertRsvp> = [];

	rsvpsToRemove.forEach(async (rsvp) => {
		await db.delete(rsvps).where(eq(rsvps.id, rsvp.id));
	})

	const segments = await db.query.timeSegments.findMany({
		where: eq(timeSegments.eventId, eventData.id)
	})

	const segmentIdToDelete: Array<string> = [];

	segments.forEach((segment) => {
		if (!isWithinInterval(segment.start, {
			start: eventData.start, end: eventData.end
		}) || !isWithinInterval(segment.end, {
			start: eventData.start, end: eventData.end
		})) {
			segmentIdToDelete.push(segment.id)
		}
	})

	newInvitees.forEach(user => {
		notificationsToCreate.push({
			type: "event",
			message: "you have been invited to an event",
			target: user.id,
			sender: data.user.id,
			event: eventData.id
		})

		rsvpsToCreate.push({
			eventId: eventData.id,
			userId: user.id,
		})
	});

	if (segmentIdToDelete.length > 0) {
		await db.delete(timeSegments).where(inArray(timeSegments.id, segmentIdToDelete))
	}

	if (notificationsToCreate.length > 0) {
		await db.insert(notifications).values(notificationsToCreate);
	}

	if (rsvpsToCreate.length > 0) {
		await db.insert(rsvps).values(rsvpsToCreate);
	}
	await db.update(events).set({ title: eventData.title, start: eventData.start, end: eventData.end, description: eventData.description }).where(eq(events.id, eventData.id))
}

export async function GetLocalUserEvents() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const attendingEvents = await db.query.rsvps.findMany({
		where: eq(rsvps.userId, data.user.id),
		with: {
			event: {
				with: { host: true }
			}
		},
	}).then((values) => {
		return values.map(v => { return { ...v.event, status: v.status } })
	})

	const hostedEvents = await db.query.events.findMany({
		where: or(eq(events.userId, data.user.id)),
		with: {
			host: true
		}
	}).then((values) => {
		return values.map(v => { return { ...v, status: "hosting" } })
	})

	const result = [...hostedEvents, ...attendingEvents]

	return result;
}

export async function GetEventData(eventId: string) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		return;
	}

	const attendingEventData = await db.query.rsvps.findFirst({
		where: and(eq(rsvps.eventId, eventId), eq(rsvps.userId, data.user.id)),
		with: {
			event: {
				with: {
					rsvps: {
						with: { user: true, segments: true }
					},
					host: true,
				}
			}
		}
	}).then((values) => {
		return values?.event
	})

	if (attendingEventData !== undefined) {
		return attendingEventData
	}

	const hostedEvents = await db.query.events.findFirst({
		where: and(eq(events.userId, data.user.id), eq(events.id, eventId)),
		with: {
			rsvps: {
				with: { user: true, segments: true }
			},
			host: true,
		}
	})

	if (hostedEvents !== undefined) {
		return hostedEvents;
	}

	return
}

export type EventDataQuery = Awaited<ReturnType<typeof GetEventData>> | undefined
export type GetLocalUserEventsType = Awaited<ReturnType<typeof GetLocalUserEvents>> | undefined;
export type EventRsvp = NonNullable<EventDataQuery>['rsvps'][number]