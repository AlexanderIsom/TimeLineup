'use server'
import { db } from "@/db";
import { events } from "@/db/schema";

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