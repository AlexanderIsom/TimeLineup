import styles from "./id.module.scss"
import React from "react";
import StaticTimeCard from "@/components/id/StaticTimeCard";
import assert from "assert";
import ScrollableContainer from "@/components/id/ScrollableContainer";
import EventDetails from "@/components/id/EventDetails";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/profileActions";
import { EventRsvp, GetEventData } from "@/actions/eventActions";
import Timeline from "@/utils/Timeline";

export default async function ViewEvent({ params }: { params: { id: string } }) {
	const localUser = await getUserProfile()

	if (localUser === undefined) {
		redirect("/");
	}

	const eventData = await GetEventData(params.id);
	assert(eventData !== undefined, "Event data returned undefined")

	const localRsvp: EventRsvp = eventData.rsvps.find(r => r.userId === localUser.id) ?? {} as EventRsvp;
	const otherRsvps: Array<EventRsvp> = eventData.rsvps.filter(r => r.userId !== localUser.id)

	otherRsvps.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "")
	})

	new Timeline(eventData.start, eventData.end, 5)

	return (
		<div className={styles.wrapper}>
			<ScrollableContainer localRSVP={localRsvp} eventData={eventData} otherRsvps={otherRsvps}>
				{otherRsvps.map((value, index: number) => {
					return <div key={index} className={styles.staticRow}>{
						value.schedules.map((schedule) => {
							return <StaticTimeCard key={schedule.id} schedule={schedule} user={value.user} />
						})
					}</div>
				})}
			</ScrollableContainer>

			<EventDetails event={eventData} localUser={localUser} />
		</div>
	)

}