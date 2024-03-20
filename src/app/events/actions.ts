'use server'
import { db } from "@/db";
import { events } from "@/db/schema";
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

	await db.insert(events).values({
		userId: data.user.id,
		title: eventData.title,
		start: new Date(eventData.start),
		end: new Date(eventData.end),
		description: eventData.description,
		invitedUsers: eventData.invitedUsers
	});
}