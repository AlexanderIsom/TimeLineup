
"use client"

import styles from "./ScrollableContainer.module.scss";
import { Button } from "../ui/button";
import TimelineNumbers from "../id/TimelineNumber";
import ClientCardContainer, { Schedule } from "../events/ClientCardContainer";
import { Event } from "@/db/schema";
import React, { useEffect, useRef, useState } from "react";
import { saveRsvp } from "@/actions/idActions"
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Timeline from "@/utils/Timeline";
import Blocker, { Side } from "./Blocker/Blocker";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventRsvp } from "@/actions/eventActions";
import StaticTimeCard from "./StaticTimeCard";

interface Props {
	localRSVP: EventRsvp
	otherRsvps: Array<EventRsvp>
	eventData: Event
	isHost: boolean
	children?: React.ReactNode
}

export default function ScrollableContainer({ localRSVP, eventData, otherRsvps, isHost, children }: Props) {
	const [scheduleState, setScheduleState] = useState<Schedule[]>(localRSVP?.schedules ?? [])

	const router = useRouter();

	const updateScheduleState = (newSchedule: Schedule[]) => {
		setScheduleState(newSchedule);
	}

	const userDiv = useRef<HTMLDivElement>(null);
	const contentDiv = useRef<HTMLDivElement>(null);
	const timeDiv = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (contentDiv.current) {

				if (userDiv.current) {
					userDiv.current.scrollTop = contentDiv.current.scrollTop
				}
				if (timeDiv.current) {
					timeDiv.current.scrollLeft = contentDiv.current.scrollLeft
				}
			}
		}

		if (contentDiv.current) {
			contentDiv.current.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (contentDiv.current) {
				contentDiv.current.removeEventListener('scroll', handleScroll);
			}
		};
	}, [])

	new Timeline(eventData.start, eventData.end, 5)

	return (
		<div className={styles.wrapper}>
			<div className={`${styles.tools} `}>

				{eventData.end > new Date() &&
					<Button onClick={() => {
						saveRsvp({ eventId: eventData.id, schedules: scheduleState, status: "attending", id: localRSVP?.id, userId: "" })
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
					{!isHost && (eventData.end > new Date() ?
						<ClientCardContainer schedules={scheduleState} updateState={updateScheduleState} /> :
						<div className={styles.staticRow}>{
							scheduleState.map((schedule) => {
								return <StaticTimeCard key={schedule.id} schedule={schedule} />
							})
						}</div>
					)}
					{children}
				</div>
			</div>
		</div >
	)
}