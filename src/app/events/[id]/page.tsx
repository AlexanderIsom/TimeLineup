import React from "react";
import EventDetails from "@/components/id/EventDetails";
import { redirect } from "next/navigation";
import { EventRsvp, GetEventData } from "@/actions/eventActions";
import Timeline from "@/components/id/Timeline";
import { getUserProfile } from "@/actions/profileActions";
import Loading from "./loading";

export default async function ViewEvent({ params }: { params: { id: string } }) {
	const profile = await getUserProfile();
	const eventData = await GetEventData(params.id);

	if (!profile) {
		redirect("/");
	}

	const localRsvp: EventRsvp = eventData?.rsvps.find((r) => r.userId === profile.id) ?? ({} as EventRsvp);
	const otherRsvps: Array<EventRsvp> = eventData?.rsvps.filter((r) => r.userId !== profile.id) ?? [];
	const isHost = eventData?.userId === profile.id;

	otherRsvps?.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "");
	});

	if (!eventData) return <div>Loading...</div>;

	return (
		<div className="flex max-h-full grow flex-col overflow-hidden">
			<Timeline isHost={isHost} localRSVP={localRsvp} eventData={eventData} otherRsvps={otherRsvps} />
			<EventDetails event={eventData} localUser={profile} />
		</div>
	);
}
