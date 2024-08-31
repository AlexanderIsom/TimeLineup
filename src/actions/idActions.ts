"use server";
import { db } from "@/db";
import { InsertSegment, RsvpStatus, rsvps, timeSegments } from "@/db/schema";
import { TimeSegment } from "@/stores/segmentStore";
import { createClient } from "@/lib/supabase/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveSegments(
	rsvpId: string,
	eventId: string,
	newSegments: Array<TimeSegment>,
	deletedSegments: Array<string>,
	updatedSegments: Array<TimeSegment>,
) {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}
	const user = data.user;

	if (!user) return;

	updateRsvpStatus(eventId, "attending");

	if (updatedSegments.length > 0) {
		updatedSegments.forEach(async (segment) => {
			await db
				.update(timeSegments)
				.set({ start: segment.start, end: segment.end })
				.where(and(eq(timeSegments.id, segment.id), eq(timeSegments.userId, user.id)));
		});
	}

	if (deletedSegments.length > 0) {
		deletedSegments.forEach(async (id) => {
			await db.delete(timeSegments).where(and(eq(timeSegments.id, id), eq(timeSegments.userId, user.id)));
		});
	}

	if (newSegments.length > 0) {
		const inserts: Array<InsertSegment> = [];

		newSegments.forEach(async (segment) => {
			inserts.push({ userId: user.id, start: segment.start, end: segment.end, rsvpId: rsvpId, eventId: eventId });
		});
		await db.insert(timeSegments).values(inserts);
	}

	revalidatePath("/");
}

export async function updateRsvpStatus(eventId: string, status: RsvpStatus) {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}
	const user = data.user;

	if (!user) return;

	await db
		.update(rsvps)
		.set({ status: status })
		.where(and(eq(rsvps.eventId, eventId), eq(rsvps.userId, user.id)));
	revalidatePath("/");
}
