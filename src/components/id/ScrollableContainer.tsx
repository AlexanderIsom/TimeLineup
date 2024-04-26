
"use client"

import styles from "./ScrollableContainer.module.scss";
import { Button } from "../ui/button";
import TimelineNumbers from "../id/TimelineNumber";
import ClientCardContainer, { TimeSegment } from "../events/ClientCardContainer";
import { Event, Schedule } from "@/db/schema";
import React, { useEffect, useRef, useState } from "react";
import { saveRsvp } from "@/actions/idActions"
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Timeline from "@/utils/Timeline";
import Blocker, { Side } from "./Blocker/Blocker";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventRsvp } from "@/actions/eventActions";
import { addMinutes, differenceInMinutes } from "date-fns";

interface Props {
	localRSVP: EventRsvp
	otherRsvps: Array<EventRsvp>
	eventData: Event
	isHost: boolean
	children?: React.ReactNode
}

export default function ScrollableContainer({ localRSVP, eventData, otherRsvps, isHost, children }: Props) {
	const [scheduleState, setScheduleState] = useState<TimeSegment[]>(() => {
		if (isHost) return [];
		const newSchedule: Array<TimeSegment> = [];
		localRSVP.schedules.forEach((schedule) => {
			const start = differenceInMinutes(schedule.start, eventData.start)
			newSchedule.push({ id: schedule.id, start: start, duration: schedule.duration })
		})
		return newSchedule
	})

	const router = useRouter();

	const updateScheduleState = (newSchedule: TimeSegment[]) => {
		setScheduleState(newSchedule);
	}

	const userDiv = useRef<HTMLDivElement>(null);
	const contentDiv = useRef<HTMLDivElement>(null);
	const timeDiv = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const div = contentDiv.current;
		const handleScroll = () => {
			if (div) {

				if (userDiv.current) {
					userDiv.current.scrollTop = div.scrollTop
				}
				if (timeDiv.current) {
					timeDiv.current.scrollLeft = div.scrollLeft
				}
			}
		}

		if (div) {
			div.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (div) {
				div.removeEventListener('scroll', handleScroll);
			}
		};
	}, [])

	new Timeline(eventData.start, eventData.end, 5)

	return (
		<div className={styles.wrapper}>
			<div className={`${styles.tools} `}>

				{eventData.end > new Date() &&
					<Button onClick={() => {
						const scheules: Array<Schedule> = [];
						scheduleState.forEach(segment => {
							const startTime = addMinutes(eventData.start, segment.start)
							scheules.push({ id: segment.id, start: startTime, duration: segment.duration })
						});
						saveRsvp({ eventId: eventData.id, schedules: scheules, status: "attending", id: localRSVP?.id, userId: "" })
						router.refresh();
					}}>Save</Button>}
			</div>

			<TimelineNumbers start={eventData.start} end={eventData.end} forwardedRef={timeDiv} />

			<div className={`flex flex-col ${styles.users}`} ref={userDiv}>
				{!isHost && <div className={`${styles.userItem}`}>
					<Avatar>
						<AvatarImage src={localRSVP?.user.avatarUrl!} />
						<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
					</Avatar>
					<div className={styles.userName}>{localRSVP?.user.username}</div>
				</div>}

				{otherRsvps.map((rsvp) => {
					return <div key={rsvp.id}>
						<div className={styles.userItem}>
							<Avatar>
								<AvatarImage src={rsvp.user.avatarUrl ?? undefined} />
								<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{rsvp.user.username ?? "user"}</div>
						</div>
					</div>
				})}
			</div>

			<div className={styles.content} ref={contentDiv}>
				<div style={{
					width: `${Timeline.getWidth()}px`,
					backgroundSize: `${Timeline.cellWidth}px`
				}} className={`${styles.gridBackground} `} >
					<Blocker side={Side.left} width={Timeline.getPadding().left} />
					<Blocker side={Side.right} width={Timeline.getPadding().right} />
					{!isHost &&
						<ClientCardContainer schedules={scheduleState} updateState={updateScheduleState} />
					}
					{children}
				</div>
			</div>
		</div >
	)
}