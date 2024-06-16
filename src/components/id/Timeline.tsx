"use client";
import { EventRsvp } from "@/actions/eventActions";
import { Event } from "@/db/schema";
import { useSegmentStore } from "@/stores/Segments";
import { createClient } from "@/utils/supabase/client";
import { useIsMobile } from "@/utils/useIsMobile";
import { differenceInMinutes } from "date-fns";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ClientCardContainer from "../events/ClientCardContainer";
import TimelineNumbers from "../id/TimelineNumber";
import ScrollbarWrapper from "../scrollbarWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import StaticTimeCard from "./StaticTimeCard";

interface Props {
	localRSVP: EventRsvp;
	otherRsvps: Array<EventRsvp>;
	eventData: Event;
	isHost: boolean;
	children?: React.ReactNode;
}

const defaultWidth = 2;

export default function Timeline({ localRSVP, eventData, otherRsvps, isHost }: Props) {
	const setSegmentStore = useSegmentStore((state) => state.setSegments);
	const totalMinutes = useMemo(
		() => differenceInMinutes(eventData.end, eventData.start),
		[eventData.start, eventData.end],
	);
	const [minuteWidth, setMinuteWidth] = useState(defaultWidth);
	const router = useRouter();
	const supabase = createClient();

	const userDiv = useRef<HTMLDivElement>(null);
	const timeDiv = useRef<HTMLDivElement>(null);

	const isMobile = useIsMobile();

	useEffect(() => {
		const idChannel = supabase
			.channel(eventData.id)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "time_segment",
					filter: `event_id=eq.${eventData.id}`,
				},
				() => {
					router.refresh();
				},
			)
			.subscribe();

		if (!isHost) {
			setSegmentStore(localRSVP.segments.map(({ id, start, end }) => ({ id, start, end })));
		}

		return () => {
			supabase.removeChannel(idChannel);
		};
	}, [supabase, router, eventData.id, localRSVP, isHost, setSegmentStore]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (totalMinutes * defaultWidth < entry.contentRect.width) {
					const newWidth = entry.contentRect.width / totalMinutes;
					console.log("setting minute width: ", newWidth);
					setMinuteWidth(newWidth);
				} else {
					console.log("setting default width: ", defaultWidth);
					setMinuteWidth(defaultWidth);
				}
			}
		});

		const div = document.getElementById("timeline-content");

		if (div) {
			resizeObserver.observe(div);
		}

		return () => {
			if (div) {
				resizeObserver.unobserve(div);
			}
		};
	}, [totalMinutes]);

	return (
		<div className="grid max-h-full grow grid-rows-[75px_minmax(0,1fr)] overflow-hidden md:grid-cols-[1fr_4fr]">
			<TimelineNumbers
				start={eventData.start}
				end={eventData.end}
				forwardedRef={timeDiv}
				minuteWidth={minuteWidth}
			/>

			{!isMobile && (
				<div
					className={`col-start-1 col-end-2 row-start-2 row-end-3 flex min-h-full min-w-fit flex-col items-center overflow-hidden border-t border-gray-300`}
					ref={userDiv}
				>
					{!isHost && (
						<div className="mx-2 flex h-16 w-full flex-row items-center justify-center gap-2 border-b border-gray-300">
							<Avatar>
								<AvatarImage src={localRSVP?.user.avatarUrl ?? undefined} />
								<AvatarFallback className="bg-gray-200">
									<User />
								</AvatarFallback>
							</Avatar>
							<div className="hidden font-medium md:flex">{localRSVP?.user.username}</div>
						</div>
					)}

					{otherRsvps.map((rsvp) => {
						return (
							<div
								key={rsvp.id}
								className="flex min-h-16 w-full flex-row items-center justify-center gap-2 border-b border-gray-300 px-2"
							>
								<Avatar>
									<AvatarImage src={rsvp.user.avatarUrl ?? undefined} />
									<AvatarFallback className="bg-gray-200">
										<User />
									</AvatarFallback>
								</Avatar>
								<div className="hidden font-medium md:flex">{rsvp.user.username ?? "user"}</div>
							</div>
						);
					})}
				</div>
			)}

			<ScrollbarWrapper
				id="timeline-content"
				defer
				className="col-start-2 col-end-2 row-start-2 row-end-3 border-l border-gray-300"
				events={{
					scroll: (event) => {
						const { scrollLeft, scrollTop } = event.elements().scrollOffsetElement;
						if (userDiv.current) {
							userDiv.current.scrollTop = scrollTop;
						}
						if (timeDiv.current) {
							timeDiv.current.scrollLeft = scrollLeft;
						}
					},
				}}
			>
				<div
					style={{
						width: `${totalMinutes * minuteWidth}px`,
					}}
					className="relative h-full"
				>
					{!isHost && (
						<ClientCardContainer minuteWidth={minuteWidth} eventData={eventData} localId={localRSVP.id} />
					)}
					{otherRsvps.map((value, index: number) => {
						return (
							<div key={index} className="flex h-16 items-center">
								{value.segments.map((schedule) => {
									return (
										<StaticTimeCard
											user={value.user}
											key={schedule.id}
											schedule={schedule}
											eventStartTime={eventData.start}
											minuteWidth={minuteWidth}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
			</ScrollbarWrapper>
		</div>
	);
}
