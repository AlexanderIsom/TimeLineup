import styles from "@/styles/Components/Events/id.module.scss"
import React from "react";
import StaticTimeCard from "@/components/events/StaticTimeCard";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Rsvp, events } from "@/db/schema"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import assert from "assert";
import ScrollableContainer from "@/components/id/ScrollableContainer";
import { differenceInMinutes } from "date-fns";
import Timeline from "@/utils/Timeline";

async function GetEventData(id: number) {
	const res = await db.query.events.findFirst({
		where: eq(events.id, id),
		with: {
			rsvps: true
		}
	});

	return res;
}

export default async function ViewEvent({ params }: { params: { id: number } }) {
	const user = await currentUser();
	const eventData = await GetEventData(params.id);
	assert(eventData, "Event data returned undefined")

	const clerkUsers = await clerkClient.users.getUserList({
		userId: [...eventData.invitedUsers, eventData.userId],
	})

	const duration = differenceInMinutes(eventData.end, eventData.start);
	new Timeline(eventData.start, duration, 1920, 5)

	const localRsvp: Rsvp | undefined = eventData?.rsvps.find(r => r.userId === user?.id)
	const otherRsvp = eventData.rsvps.filter(r => r.userId !== user?.id)
	{
		return (<>
			<div className={styles.wrapper}>
				<div className={styles.scrollable}>
					<div className={styles.userContainer}>
						<div className={styles.userItem}>
							<Avatar>
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>{user?.firstName?.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{user?.firstName}</div>
						</div>

						{otherRsvp.map((rsvpUser) => {
							const userData = clerkUsers.find(v => v.id === rsvpUser.userId)
							return <div key={rsvpUser.id} className={styles.userItem}>
								<Avatar>
									<AvatarImage src={userData?.imageUrl} />
									<AvatarFallback>{userData?.firstName?.substring(0, 2)}</AvatarFallback>
								</Avatar>
								<div className={styles.userName}>{userData?.firstName ?? ""}</div>
							</div>
						})}
					</div>
					<ScrollableContainer localRSVP={localRsvp} eventData={eventData} duration={duration}>
						<div className={styles.userResponses}>
							{otherRsvp.map((value, index: number) => {
								return <div key={index} className={styles.staticRow}>{
									value.schedules.map((schedule) => {
										return <StaticTimeCard key={schedule.id} start={schedule.start} duration={schedule.duration} />
									})
								}</div>
							})}
						</div>
					</ScrollableContainer>
				</div>
				{/* <EventDetails event={event} responseState={responseState} onStateChange={(newState: ResponseState) => { onResponseStateChange(newState) }} /> */}
			</div>
		</>)
	}
}