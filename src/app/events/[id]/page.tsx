import styles from "./id.module.scss"
import React from "react";
import assert from "assert";
import EventDetails from "@/components/id/EventDetails";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/profileActions";
import { EventRsvp, GetEventData } from "@/actions/eventActions";
import Timeline from "@/components/id/Timeline"

export default async function ViewEvent({ params }: { params: { id: string } }) {
	const localUser = await getUserProfile()

	if (localUser === undefined) {
		redirect("/");
	}

	const eventData = await GetEventData(params.id);
	assert(eventData !== undefined, "Event data returned undefined")

	const localRsvp: EventRsvp = eventData.rsvps.find(r => r.userId === localUser.id) ?? {} as EventRsvp;
	const otherRsvps: Array<EventRsvp> = eventData.rsvps.filter(r => r.userId !== localUser.id)
	const isHost = eventData.userId === localUser.id;

	otherRsvps.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "")
	})

	return (
		<div className={styles.wrapper}>
			<Timeline isHost={isHost} localRSVP={localRsvp} eventData={eventData} otherRsvps={otherRsvps} />
			<EventDetails event={eventData} localUser={localUser} />
		</div>
	)

}