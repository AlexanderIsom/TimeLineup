"use client"

import styles from "./ScrollableContainer.module.scss";
import { Button } from "../ui/button";
import TimelineNumbers from "../id/TimelineNumber";
import ClientCardContainer from "../events/ClientCardContainer";
import { Event } from "@/db/schema";
import React, { useEffect, useMemo, useRef } from "react";
import { saveSegments } from "@/actions/idActions"
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Timeline from "@/utils/Timeline";
import Blocker, { Side } from "./Blocker/Blocker";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventRsvp } from "@/actions/eventActions";
import { useSegmentStore } from "@/store/Segments";

interface Props {
	localRSVP: EventRsvp
	otherRsvps: Array<EventRsvp>
	eventData: Event
	isHost: boolean
	children?: React.ReactNode
}

export default function ScrollableContainer({ localRSVP, eventData, otherRsvps, isHost, children }: Props) {
	const segmentStore = useSegmentStore((state) => state);
	const setSegmentStore = useSegmentStore((state) => state.setSegments)
	useMemo(() => {
		if (!isHost) {
			setSegmentStore(localRSVP.segments.map(({ id, start, end }) => ({ id, start, end })));
		}
	}, [localRSVP, isHost, setSegmentStore])

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
			Timeline.setMinWidth(div.clientWidth)
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
					<Button onClick={async () => {
						await saveSegments(localRSVP.id, eventData.id, segmentStore.newSegments, segmentStore.deletedSegments, segmentStore.updatedSegments)
					}}>Save</Button>}
			</div>

			<TimelineNumbers start={eventData.start} end={eventData.end} forwardedRef={timeDiv} />

			<div className={`flex flex-col ${styles.users}`} ref={userDiv}>
				{!isHost && <div className={`${styles.userItem}`}>
					<Avatar>
						<AvatarImage src={localRSVP?.user.avatarUrl ?? undefined} />
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

			<div className={`${styles.content}`} ref={contentDiv}>
				<div style={{
					width: `${Timeline.getWidth()}px`,
					backgroundSize: `${Timeline.cellWidth}px`
				}} className={`${styles.gridBackground} `} >
					<Blocker side={Side.left} width={Timeline.getPadding().left} />
					<Blocker side={Side.right} width={Timeline.getPadding().right} />
					{!isHost &&
						<ClientCardContainer />
					}
					{children}
				</div>
			</div>
		</div >
	)
}