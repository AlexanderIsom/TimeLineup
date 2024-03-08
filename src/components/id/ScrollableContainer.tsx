'use client'

import styles from "@/styles/Components/Events/id.module.scss";
import { Button } from "../ui/button";
import { RxZoomIn, RxZoomOut } from "react-icons/rx";
import TimelineNumbers from "../events/TimelineNumber";
import ClientCardContainer, { Schedule } from "../events/ClientCardContainer";
import { Event, Rsvp } from "@/db/schema";
import React, { useState } from "react";
import { createRSVP } from "@/app/actions/actions"

interface Props {
	localRSVP?: Rsvp
	eventData: Event
	children: React.ReactNode
	duration: number
}

export default function ScrollableContainer({ localRSVP, eventData, children, duration }: Props) {
	const designSize = 1920
	const [scheduleState, setScheduleState] = useState<Schedule[]>(localRSVP?.schedules ?? [])

	const updateScheduleState = (newSchedule: Schedule[]) => {
		setScheduleState(newSchedule);
	}

	return (
		<div className={styles.timelineContainer}>
			<div className={styles.timelineHeader}>
				<div className={styles.timelineTools}>
					<div className={styles.magnify}>
						{/* <div className={styles.buttonLeft} onClick={handleZoomIn}>< RxZoomIn className={styles.zoomIcon} /></div>
							<div className={styles.buttonRight} onClick={handleZoomOut}><RxZoomOut className={styles.zoomIcon} /></div> */}
						<div className={styles.buttonLeft} >< RxZoomIn className={styles.zoomIcon} /></div>
						<div className={styles.buttonRight} ><RxZoomOut className={styles.zoomIcon} /></div>
						<Button onClick={() => {
							createRSVP({ eventId: eventData.id, schedules: scheduleState, rejected: false, rsvpId: localRSVP?.id })
						}}>Save</Button>
					</div>
				</div>
			</div>
			{/* <div className={styles.timelineContent} onScroll={onContentScroll} ref={timelineScrollingContainerRef}> */}
			<div className={styles.timelineContent} >
				<div style={{
					width: `${designSize}px`,
					backgroundSize: `${designSize / Math.round(duration / 60)}px`
				}} className={`${styles.gridBackground} `} >
					<TimelineNumbers start={new Date(eventData.start)} end={new Date(eventData.end)} />
					<ClientCardContainer schedules={scheduleState} eventStartDate={eventData.start} eventEndDate={eventData.end} updateState={updateScheduleState} />
					{children}
				</div>
			</div>
		</div>
	)
}