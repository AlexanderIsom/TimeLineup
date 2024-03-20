import styles from "@/styles/Components/Events/id.module.scss"
import React from "react";
import StaticTimeCard from "@/components/events/StaticTimeCard";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Profile, Rsvp, events, profiles } from "@/db/schema"
import { db } from "@/db";
import { arrayOverlaps, eq, inArray } from "drizzle-orm";
import assert from "assert";
import ScrollableContainer from "@/components/id/ScrollableContainer";
import { differenceInMinutes } from "date-fns";
import Timeline from "@/utils/Timeline";
import EventDetails from "@/components/events/EventDetails";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function GetEventData(eventId: string) {
	const eventData = await db.query.events.findFirst({
		where: eq(events.id, eventId),
		with: {
			rsvps: {
				with: { user: true }
			}
		}
	});

	let inviteeData: Array<Profile> = [];
	if (eventData?.invitedUsers !== undefined && eventData.invitedUsers.length > 0) {
		inviteeData = await db.query.profiles.findMany({
			where: inArray(profiles.id, eventData?.invitedUsers)
		})
	}
	return { eventData, inviteeData }
}

export default async function ViewEvent({ params }: { params: { id: string } }) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		redirect("/login");
	}
	const localUser = data.user;

	const { eventData, inviteeData } = await GetEventData(params.id);
	assert(eventData, "Event data returned undefined")

	const duration = differenceInMinutes(eventData.end, eventData.start);
	new Timeline(eventData.start, duration, 1920, 5)

	const localRsvp: Rsvp | undefined = eventData?.rsvps.find(r => r.userId === localUser.id)
	const otherRsvp = eventData.rsvps.filter(r => r.userId !== localUser.id)

	otherRsvp.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "")
	})

	return (
		<div className={styles.wrapper}>
			<div className={styles.scrollable}>
				<div className={styles.userContainer}>
					<div className={styles.userItem}>
						<Avatar>
							<AvatarImage src={localUser.user_metadata.picture} />
							<AvatarFallback>{localUser.user_metadata.full_name.substring(0, 2)}</AvatarFallback>
						</Avatar>
						<div className={styles.userName}>{localUser.user_metadata.full_name}</div>
					</div>

					{otherRsvp.map((rsvpUser) => {
						return <div key={rsvpUser.user.id} className={styles.userItem}>
							<Avatar>
								<AvatarImage src={rsvpUser.user.avatarUrl ?? undefined} />
								<AvatarFallback>{rsvpUser.user.username ?? "user".substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{rsvpUser.user.username ?? "user"}</div>
						</div>
					})}
				</div>
				<ScrollableContainer localRSVP={localRsvp} eventData={eventData} duration={duration}>
					<div className={styles.userResponses}>
						{otherRsvp.map((value, index: number) => {
							return <div key={index} className={styles.staticRow}>{
								value.schedules.map((schedule) => {
									return <StaticTimeCard key={schedule.id} schedule={schedule} user={value.user} />
								})
							}</div>
						})}
					</div>
				</ScrollableContainer>
			</div>
			{/* <EventDetails localUser={localUser!} event={eventData} localRsvp={localRsvp} otherRsvp={otherRsvp} /> */}
		</div>
	)

}