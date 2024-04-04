'use server'
import { db } from "@/db";
import { InsertNotification, events, notificationType, notifications } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

export interface newEventData {
	userId: string;
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

	await db.insert(notifications).values(notificationsToCreate);

	return newEvent[0].id
}