import styles from "@/styles/Components/Events/id.module.scss"
import React from "react";
import StaticTimeCard from "@/components/events/StaticTimeCard";
import { RxZoomIn, RxZoomOut, RxCircleBackslash } from "react-icons/rx"
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Rsvp, events } from "@/db/schema"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import TimelineNumbers from "@/components/events/TimelineNumber";
import assert from "assert";
import ClientCardContainer from "@/components/events/ClientCardContainer";
import { Button } from "@/components/ui/button";

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
	const designSize = 1920
	const user = await currentUser();
	const eventData = await GetEventData(params.id);
	assert(eventData, "Event data returned undefined")

	const clerkUsers = await clerkClient.users.getUserList({
		userId: [...eventData.invitedUsers, eventData.userId],
	})
	const localRsvp: Rsvp | undefined = eventData?.rsvps.find(r => r.userId === user?.id)
	const otherRsvp = eventData.rsvps.filter(r => r.userId !== user?.id)
	{
		return (<>
			<div className={styles.wrapper}>
				<div className={styles.scrollable}>
					<div className={styles.userContainer}>
						<div className={styles.userItem}> {/*TODO server component */}
							<Avatar>
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>{user?.firstName?.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{user?.firstName}</div>
						</div>

						{otherRsvp.map((user) => {
							const userData = clerkUsers[user.id]
							return <div key={user.id} className={styles.userItem}>
								<Avatar>
									<AvatarImage src={userData?.imageUrl} />
									<AvatarFallback>{userData?.firstName?.substring(0, 2)}</AvatarFallback>
								</Avatar>
								<div className={styles.userName}>{userData.firstName}</div>
							</div>
						})}
					</div>
					<div className={styles.timelineContainer}> {/*TODO client component */}
						<div className={styles.timelineHeader}>
							<div className={styles.timelineTools}>
								<div className={styles.magnify}>
									{/* <div className={styles.buttonLeft} onClick={handleZoomIn}>< RxZoomIn className={styles.zoomIcon} /></div>
									<div className={styles.buttonRight} onClick={handleZoomOut}><RxZoomOut className={styles.zoomIcon} /></div> */}
									<div className={styles.buttonLeft} >< RxZoomIn className={styles.zoomIcon} /></div>
									<div className={styles.buttonRight} ><RxZoomOut className={styles.zoomIcon} /></div>
									<Button>Save</Button>
								</div>
							</div>
						</div>
						{/* <div className={styles.timelineContent} onScroll={onContentScroll} ref={timelineScrollingContainerRef}> */}
						<div className={styles.timelineContent} >
							{/* <div style={{
								width: `${designWidth}px`,
								backgroundSize: `${designWidth / Math.round(event.duration / 60)}px`
							}} ref={timelineContainerRef} className={`${styles.gridBackground} `} > */}
							<div style={{
								width: `${designSize}px`,
								// backgroundSize: `${designWidth / Math.round(event.duration / 60)}px`
							}} className={`${styles.gridBackground} `} >
								<TimelineNumbers start={new Date(eventData.start)} end={new Date(eventData.end)} />
								<ClientCardContainer schedules={localRsvp?.schedules ?? []} eventStartDate={eventData.start} eventEndDate={eventData.end} />
								<div className={styles.userResponses}> {/*TODO server component and move this out*/}
									{otherRsvp.map((value, index: number) => {
										return <div key={index} className={styles.staticRow}>{
											value.schedules.map((schedule) => {
												return <StaticTimeCard key={schedule.id} start={schedule.start} duration={schedule.duration} />
											})
										}</div>
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Server component */}
				{/* <EventDetails event={event} responseState={responseState} onStateChange={(newState: ResponseState) => { onResponseStateChange(newState) }} /> */}
			</div>
		</>)
	}
}