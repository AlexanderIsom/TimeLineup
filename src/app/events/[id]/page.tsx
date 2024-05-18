"use client"
import React from "react";
import EventDetails from "@/components/id/EventDetails";
import { redirect } from "next/navigation";
import { EventRsvp } from "@/actions/eventActions";
import Timeline from "@/components/id/Timeline"
import { useIsMobile } from "@/utils/useIsMobile";
import { useEventData, useProfile } from "@/swr/swrFunctions";

export default function ViewEvent({ params }: { params: { id: string } }) {
	const { profile, isLoading: profileLoading } = useProfile()

	if (profile === undefined && !profileLoading) {
		redirect("/");
	}


	const { eventData, isLoading: isEventLoading } = useEventData(params.id);

	const isMobile = useIsMobile();

	if (!profile) return <></>;

	const localRsvp: EventRsvp = eventData?.rsvps.find(r => r.userId === profile.id) ?? {} as EventRsvp;
	const otherRsvps: Array<EventRsvp> = eventData?.rsvps.filter(r => r.userId !== profile.id) ?? [];
	const isHost = eventData?.userId === profile.id;

	otherRsvps?.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "")
	})

	return (
		<div className="grid h-full md:grid-cols-[minmax(0,_4fr)_minmax(300px,_1fr)]">
			{eventData && <>
				<Timeline isHost={isHost} localRSVP={localRsvp} eventData={eventData} otherRsvps={otherRsvps} />
				{!isMobile && <EventDetails event={eventData} localUser={profile} />}
			</>
			}
		</div>
	)

}

