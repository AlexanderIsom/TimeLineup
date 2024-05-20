"use client"
import TimelineNumbers from "../id/TimelineNumber";
import ClientCardContainer from "../events/ClientCardContainer";
import { Event } from "@/db/schema";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventRsvp } from "@/actions/eventActions";
import { useSegmentStore } from "@/store/Segments";
import { differenceInMinutes } from "date-fns";
import StaticTimeCard from "./StaticTimeCard";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/utils/useIsMobile";

interface Props {
	localRSVP: EventRsvp
	otherRsvps: Array<EventRsvp>
	eventData: Event
	isHost: boolean
	children?: React.ReactNode
}

const defaultWidth = 2;

export default function Timeline({ localRSVP, eventData, otherRsvps, isHost }: Props) {
	const setSegmentStore = useSegmentStore((state) => state.setSegments)
	const totalMinutes = useMemo(() => differenceInMinutes(eventData.end, eventData.start), [eventData.start, eventData.end]);
	const [minuteWidth, setMinuteWidth] = useState(defaultWidth);
	const router = useRouter();
	const supabase = createClient();

	const userDiv = useRef<HTMLDivElement>(null);
	const contentDiv = useRef<HTMLDivElement>(null);
	const timeDiv = useRef<HTMLDivElement>(null);

	const isMobile = useIsMobile();

	useEffect(() => {
		const idChannel = supabase.channel(eventData.id).on('postgres_changes', {
			event: '*',
			schema: 'public',
			table: 'time_segment',
			filter: `event_id=eq.${eventData.id}`
		}, () => {
			router.refresh();
		}).subscribe();

		if (!isHost) {
			setSegmentStore(localRSVP.segments.map(({ id, start, end }) => ({ id, start, end })));
		}

		return () => {
			supabase.removeChannel(idChannel)
		}
	}, [supabase, router, eventData.id, localRSVP, isHost, setSegmentStore])

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

		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				if (totalMinutes * defaultWidth < entry.contentRect.width) {
					setMinuteWidth(entry.contentRect.width / totalMinutes);
				} else {
					setMinuteWidth(defaultWidth);
				}
			}
		});

		if (div) {
			div.addEventListener('scroll', handleScroll);
			resizeObserver.observe(div);
		}

		return () => {
			if (div) {
				div.removeEventListener('scroll', handleScroll);
				resizeObserver.unobserve(div);
			}
		};
	}, [totalMinutes])

	return (
		<div className="grid col-start-1 col-end-2 md:grid-cols-[1fr_4fr] grid-rows-[75px_minmax(0,1fr)] h-full overflow-hidden">
			<TimelineNumbers start={eventData.start} end={eventData.end} forwardedRef={timeDiv} minuteWidth={minuteWidth} />

			{!isMobile && <div className={`flex flex-col min-w-fitoverflow-hidden border-t border-gray-300 items-center row-start-2 row-end-3 col-start-1 col-end-2`} ref={userDiv}>
				{!isHost && <div className="flex flex-row gap-2 mx-2 items-center justify-center w-full h-16 border-b border-gray-300">
					<Avatar>
						<AvatarImage src={localRSVP?.user.avatarUrl ?? undefined} />
						<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
					</Avatar>
					<div className="font-medium hidden md:flex">{localRSVP?.user.username}</div>
				</div>}

				{otherRsvps.map((rsvp) => {
					return <div key={rsvp.id} className="flex flex-row gap-2 mx-2 items-center justify-center w-full h-16 border-b border-gray-300 ">
						<Avatar>
							<AvatarImage src={rsvp.user.avatarUrl ?? undefined} />
							<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
						</Avatar>
						<div className="font-medium hidden md:flex">{rsvp.user.username ?? "user"}</div>
					</div>

				})}
			</div>}

			{isMobile && <div >
				{/* TODO: implement event details dialog / drawer */}
			</div>}

			<div className="row-start-2 row-end-3 col-start-2 col-end-2 overflow-y-auto overflow-x-scroll border-l border-gray-300" ref={contentDiv}>
				<div style={{
					width: `${totalMinutes * minuteWidth}px`,
				}} className="w-full h-full relative" >
					{!isHost &&
						<ClientCardContainer minuteWidth={minuteWidth} eventData={eventData} localId={localRSVP.id} />
					}
					{otherRsvps.map((value, index: number) => {
						return <div key={index} className="flex h-16 items-center">{
							value.segments.map((schedule) => {
								return <StaticTimeCard user={value.user} key={schedule.id} schedule={schedule} eventStartTime={eventData.start} minuteWidth={minuteWidth} />
							})
						}</div>
					})}
				</div>
			</div>
		</div>
	)
}