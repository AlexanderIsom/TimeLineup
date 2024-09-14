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

export async function GetEventsAsHost() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;
	const { data } = await supabase
		.from("event")
		.select("*, host_profile:profile(*), rsvp(*)")
		.eq("host", user.id)
		.order("start_time");
}

export async function GetEventsAsAttendee() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const { data: result, error } = await supabase
		.from("rsvp")
		.select("*, event:event(*, host_profile:profile(*))")
		.eq("user_id", user.id)
		.order("start_time", { referencedTable: "event" });

	if (error) {
		console.log(error);
	}

	return result;
}

export type GetLocalUserEventsType = Awaited<ReturnType<typeof GetEventsAsAttendee>> | undefined;
