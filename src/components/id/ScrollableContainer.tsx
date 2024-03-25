'use client'

import styles from "@/styles/Components/Events/id.module.scss";
import { Button } from "../ui/button";
import TimelineNumbers from "../events/TimelineNumber";
import ClientCardContainer, { Schedule } from "../events/ClientCardContainer";
import { Event, Rsvp } from "@/db/schema";
import React, { useState } from "react";
import { saveRsvp } from "@/app/events/[id]/actions"
import { useRouter } from "next/navigation";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
	localRSVP?: Rsvp
	eventData: Event
	children: React.ReactNode
	duration: number
}

export default function ScrollableContainer({ localRSVP, eventData, children, duration }: Props) {
	const designSize = 1920
	const [scheduleState, setScheduleState] = useState<Schedule[]>(localRSVP?.schedules ?? [])

	const router = useRouter();

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
						<div className={styles.buttonLeft} >< ZoomIn className={styles.zoomIcon} /></div>
						<div className={styles.buttonRight} ><ZoomOut className={styles.zoomIcon} /></div>
						<Button onClick={() => {
							saveRsvp({ eventId: eventData.id, schedules: scheduleState, rejected: false, rsvpId: localRSVP?.id })
							router.refresh();
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