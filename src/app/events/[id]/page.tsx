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
import EventDetails from "@/components/events/EventDetails";
import { User } from "@clerk/nextjs/server";

interface ClerkUserData {
	id: string;
	firstName: string;
	imageUrl: string;
}

async function GetEventData(id: number) {
	let res = await db.query.events.findFirst({
		where: eq(events.id, id),
		with: {
			rsvps: true
		}
	});

	const clerkUsers = await clerkClient.users.getUserList({
		userId: res?.rsvps.map(r => r.userId) ?? [],
		limit: 100,
	})

	const usersIndexedById = clerkUsers.reduce<{ [id: string]: User }>((acc, obj) => {
		acc[obj.id] = obj;
		return acc
	}, {});

	const newRsvps = res!.rsvps.map(obj => {
		const rsvpUser = usersIndexedById[obj.userId];
		const userData: ClerkUserData = {
			id: rsvpUser.id,
			firstName: rsvpUser.firstName ?? "",
			imageUrl: rsvpUser.imageUrl
		}
		return {
			...obj,
			user: userData
		}
	});

	const newRes = { ...res!, rsvps: newRsvps };

	return newRes;
}

export default async function ViewEvent({ params }: { params: { id: number } }) {
	const localUser = await currentUser();
	const eventData = await GetEventData(params.id);
	assert(eventData, "Event data returned undefined")

	const duration = differenceInMinutes(eventData.end, eventData.start);
	new Timeline(eventData.start, duration, 1920, 5)

	const localRsvp: Rsvp | undefined = eventData?.rsvps.find(r => r.userId === localUser?.id)
	const otherRsvp = eventData.rsvps.filter(r => r.userId !== localUser?.id)

	otherRsvp.sort((a, b) => {
		return (a.user.firstName).localeCompare(b.user.firstName)
	})

	return (
		<div className={styles.wrapper}>
			<div className={styles.scrollable}>
				<div className={styles.userContainer}>
					<div className={styles.userItem}>
						<Avatar>
							<AvatarImage src={localUser?.imageUrl} />
							<AvatarFallback>{localUser?.firstName?.substring(0, 2)}</AvatarFallback>
						</Avatar>
						<div className={styles.userName}>{localUser?.firstName}</div>
					</div>

					{otherRsvp.map((rsvpUser) => {
						return <div key={rsvpUser.user.id} className={styles.userItem}>
							<Avatar>
								<AvatarImage src={rsvpUser.user.imageUrl} />
								<AvatarFallback>{rsvpUser.user?.firstName?.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{rsvpUser.user?.firstName ?? ""}</div>
						</div>
					})}
				</div>
				<ScrollableContainer localRSVP={localRsvp} eventData={eventData} duration={duration}>
					<div className={styles.userResponses}>
						{otherRsvp.map((value, index: number) => {
							return <div key={index} className={styles.staticRow}>{
								value.schedules.map((schedule) => {
									return <StaticTimeCard key={schedule.id} start={schedule.start} duration={schedule.duration} eventStartDate={eventData.start} username={value.user.firstName} />
								})
							}</div>
						})}
					</div>
				</ScrollableContainer>
			</div>
			<EventDetails localUser={localUser!} event={eventData} localRsvp={localRsvp} otherRsvp={otherRsvp} />
		</div>
	)

}