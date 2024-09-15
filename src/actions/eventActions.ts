"use server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function deleteEvent(eventId: string) {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) {
		return;
	}

	await db.delete(events).where(and(eq(events.id, eventId), eq(events.userId, user.id)));

	redirect("/events");
}

export async function GetEvents() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const { data, error } = await supabase
		.from("event")
		.select("*, host_profile:profile(*), rsvps:rsvp(*)")
		.order("start_time");

	if (error) {
		console.log(error);
	}

	const result = data?.map((event) => {
		return {
			...event,
			is_host: event.host === user.id,
			local_rsvp: event.rsvps.find((rsvp) => rsvp.user_id === user.id),
		};
	});

	return result;
}

export type GetLocalUserEventsType = Awaited<ReturnType<typeof GetEvents>> | undefined;
