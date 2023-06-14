import { prisma } from "lib/db";
import { Event, EventResponse, TimePair } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/id.module.scss"
import { add, isEqual, isWithinInterval, max, min, roundToNearestMinutes, setDate } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Avatar from "@radix-ui/react-avatar"
import { RxScissors, RxZoomIn, RxZoomOut, RxCircleBackslash } from "react-icons/rx"
import { TbTrashX } from "react-icons/tb"

import { Inter } from "@next/font/google";
import dropdownStyle from "styles/Components/Dropdown.module.scss"
import EventDetails from "components/EventDetails";

interface EventProps {
	event: Event
	userResponses: EventResponse[];
}

class EnumX {
	static of<T extends object>(e: T) {
		const values = Object.values(e)
		return {
			next: <K extends keyof T>(v: T[K]) => values[(Math.min(values.indexOf(v) + 1, values.length - 1))],
			previous: <K extends keyof T>(v: T[K]) => values[(Math.max(values.indexOf(v) - 1, 0))],
		}
	}
}

const ZoomLevels = [
	0.5,
	1,
	1.5,
	2
]

interface menu {
	x?: number,
	y?: number,
	showing: boolean,
	currentId?: string
}

const inter = Inter({ weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] })

export default function ViewEvent({ event, userResponses }: EventProps) {
	event.startDateTime = new Date(event.startDateTime);
	event.endDateTime = new Date(event.endDateTime);
	const router = useRouter();
	const [scheduleState, setScheduleState] = useState<TimePair[]>([])
	const [hasLoaded, setHasLoaded] = useState<boolean>(false)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	let designWidth = designSize * currentZoom
	const [showMenu, setShowMenu] = useState<menu>({ showing: false })
	const containerRef = useRef<HTMLDivElement>(null);
	const userContainerRef = useRef<HTMLDivElement>(null);

	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, ref: containerRef })
	const bounds = { start: new Date(event.startDateTime), end: new Date(event.endDateTime) }
	const [contentLastScroll, setContentLastScroll] = useState(0);

	const handleSave = useCallback(async () => {
		localStorage.setItem(event.id, JSON.stringify(scheduleState))
	}, [event, scheduleState])


	// for demo site use only
	userResponses.forEach(response => {
		response.schedule.forEach(item => {
			item.start = new Date(item.start)
			item.end = new Date(item.end)

			item.start.setDate(event.startDateTime.getDate())
			item.start.setMonth(event.startDateTime.getMonth())
			item.start.setFullYear(event.startDateTime.getFullYear())

			item.end.setMonth(event.startDateTime.getMonth())
			item.end.setDate(event.startDateTime.getDate())
			item.end.setFullYear(event.startDateTime.getFullYear())
		});
	});

	const attendingUsers = userResponses.filter((response) => {
		return response.schedule.length > 0;
	})


	useEffect(() => {
		function handleUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			handleSave();
		}

		window.addEventListener("beforeunload", handleUnload)
		router.events.on('routeChangeStart', handleSave)

		const scheduleString = localStorage.getItem(event.id)
		const schedule = scheduleString !== null ? JSON.parse(scheduleString) : [];

		if (scheduleState.length === 0 && !hasLoaded && schedule.length !== 0) {
			setHasLoaded(true)
			setScheduleState(schedule)
		}

		return () => {
			window.removeEventListener("beforeunload", handleUnload)
			router.events.off('routeChangeStart', handleSave)
		}
	}, [showMenu, router, handleSave, event, setScheduleState, scheduleState, hasLoaded, setHasLoaded])


	function handleCreate(start: Date, end: Date, table: TimePair[]): TimePair[] {
		const newSchedule = Array.from(table);
		newSchedule.push({ start: start, end: end, id: uuidv4() })
		return newSchedule;
	}

	function handleDelete(idToDelete: string, table: TimePair[]): TimePair[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function handleSplit(idToSplit: string, splitAtX: number, table: TimePair[]): TimePair[] {
		var bounds = containerRef.current!.getBoundingClientRect();
		const currentTimePair = table.find(r => r.id === idToSplit)
		if (currentTimePair) {
			const startTime = currentTimePair.start;
			const endTime = currentTimePair.end
			const midTime = roundToNearestMinutes(timeline.toDate(splitAtX - bounds.left), { nearestTo: 15 });

			let newSchedule = handleDelete(idToSplit, table);
			newSchedule = handleCreate(startTime, midTime, newSchedule);
			newSchedule = handleCreate(midTime, endTime, newSchedule);
			return newSchedule
		}
		return table
	}

	function checkForOverlap(table: Array<TimePair>, start: Date, end: Date): Array<TimePair> {
		const overlappingResponses = table.filter(s => {
			s.start = new Date(s.start);
			s.end = new Date(s.end);
			const isStartOverlapping = !isEqual(start, s.end) && isWithinInterval(start, { start: s.start, end: s.end })
			const isEndOverlapping = !isEqual(end, s.start) && isWithinInterval(end, { start: s.start, end: s.end })
			const isAllOverlapping = start < s.start && end > s.end;

			if (isStartOverlapping || isEndOverlapping || isAllOverlapping) {
				return true;
			}
		});
		return overlappingResponses;
	}

	function handleUpdate(id: string, newStart: Date, newEnd: Date) {
		let filteredUserResponses = scheduleState.filter(s => s.id !== id);
		const overlappingEvents = checkForOverlap(filteredUserResponses, newStart, newEnd);

		if (overlappingEvents.length > 0) {
			const startTimes = overlappingEvents.map(e => e.start)
			const endTimes = overlappingEvents.map(e => e.end)
			startTimes.push(newStart);
			endTimes.push(newEnd);
			const start = min(startTimes)
			const end = max(endTimes)
			overlappingEvents.forEach(event => {
				filteredUserResponses = handleDelete(event.id, filteredUserResponses);
			});
			filteredUserResponses = handleCreate(start, end, filteredUserResponses)
		} else {
			filteredUserResponses.push({ id: id, start: newStart, end: newEnd })
		}

		setScheduleState(filteredUserResponses);
	}

	function onClickHandler(e: React.MouseEvent, pairId: string) {
		setShowMenu({ x: e.clientX, y: e.clientY, showing: true, currentId: pairId })
	}

	function handleZoomOut() {
		const newZoom = EnumX.of(ZoomLevels).previous(currentZoom)
		setCurrentZoom(newZoom);
		designWidth = designSize * newZoom
	}

	function handleZoomIn() {
		const newZoom = EnumX.of(ZoomLevels).next(currentZoom)
		setCurrentZoom(newZoom);
		designWidth = designSize * newZoom
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		var bounds = containerRef.current!.getBoundingClientRect();
		const newX = e.clientX - bounds.left;
		const startTime = timeline.toDate(newX);
		startTime.setMinutes(0, 0, 0);
		const endTime = add(startTime, { hours: 1 })

		if (checkForOverlap(scheduleState, startTime, endTime).length == 0) {
			const newSchedule = handleCreate(startTime, endTime, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	const onContentScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		if (e.currentTarget.scrollTop !== contentLastScroll) {
			userContainerRef.current!.scrollTop = e.currentTarget.scrollTop;
			setContentLastScroll(e.currentTarget.scrollTop);
		}
	}

	return (<>
		<div className={styles.wrapper}>
			<div className={styles.scrollable}>
				<div className={styles.userContainer} ref={userContainerRef}>
					<div className={styles.userItem}>
						<Avatar.Root className={styles.avatarRoot} >
							<Avatar.Image src={`/UserIcons/demo.png`} alt={"demo user"} className={styles.userAvatar} />
							<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
								{"DE"}
							</Avatar.Fallback>
						</Avatar.Root>
						<div className={styles.userName}>Demo user</div>
					</div>

					{attendingUsers.map((eventResponse: EventResponse, index: number) => {
						return <div key={eventResponse.user.id} className={styles.userItem}>
							<Avatar.Root className={styles.avatarRoot} >
								<Avatar.Image src={`/UserIcons/${eventResponse.user.image}.png`} alt={eventResponse.user.name} className={styles.userAvatar} />
								<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
									{eventResponse.user.name.slice(0, 2)}
								</Avatar.Fallback>
							</Avatar.Root>
							<div className={styles.userName}>{eventResponse.user.name}</div>
						</div>
					})}
				</div>
				<div className={styles.timelineContainer}>
					<div className={styles.timelineHeader}>
						<div className={styles.timelineTools}>
							<div className={styles.magnify}>
								<div className={styles.buttonLeft} onClick={handleZoomIn}>< RxZoomIn className={styles.icon} /></div>
								<div className={styles.buttonRight} onClick={handleZoomOut}><RxZoomOut className={styles.icon} /></div>
							</div>
						</div>
					</div>
					<div className={styles.timelineContent} onScroll={onContentScroll} >

						<div className={`${styles.gridBackground} `} style={{
							width: designWidth,
							backgroundSize: `${timeline.getWidth() / timeline.hoursCount}px`
						}} ref={containerRef} >
							<TimelineNumbers start={event.startDateTime} end={event.endDateTime} />
							<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick}>
								{scheduleState.map((schedule: TimePair) => {
									return <ResizableTimeCard
										key={schedule.id}
										schedule={schedule}
										timeline={timeline}
										updateHandler={handleUpdate}
										onClickHandler={onClickHandler}
										bounds={bounds}
									/>
								})}
							</div>
							<div className={styles.userResponses}>
								{attendingUsers.map((eventResponse: EventResponse, index: number) => {
									return <div key={index} className={styles.staticRow}>{
										eventResponse.schedule.map((sch: TimePair) => {
											return <StaticTimeCard key={sch.id} schedule={sch} timeline={timeline} />
										})
									}</div>
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
			<EventDetails event={event} userResponses={userResponses} localResponse={scheduleState} />
		</div>

		<DropdownMenu.Root open={showMenu.showing} onOpenChange={(open: boolean) => { setShowMenu({ showing: open }) }}>
			<DropdownMenu.Portal >
				<DropdownMenu.Content className={dropdownStyle.content} style={{ top: `${showMenu.y}px`, left: `${showMenu.x}px`, position: "absolute", }}>
					<DropdownMenu.Label className={dropdownStyle.label} >Tools</DropdownMenu.Label>
					<DropdownMenu.Separator className={dropdownStyle.sepparator} />
					<DropdownMenu.Group className={dropdownStyle.group}>
						<DropdownMenu.Item className={dropdownStyle.item} onSelect={() => {
							const newSchedule = handleSplit(showMenu.currentId!, showMenu.x!, scheduleState)
							setScheduleState(newSchedule);
						}}>
							<RxScissors className={dropdownStyle.icon} />
							Split
						</DropdownMenu.Item>

						<DropdownMenu.Item className={dropdownStyle.item} onSelect={() => {
							const newSchedule = handleDelete(showMenu.currentId!, scheduleState)
							setScheduleState(newSchedule);
						}}>
							<TbTrashX className={dropdownStyle.icon} style={{ strokeWidth: "1" }} />
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator className={dropdownStyle.sepparator} />
					<DropdownMenu.Item className={dropdownStyle.item} onSelect={() => {

					}}>
						<RxCircleBackslash className={dropdownStyle.icon} />
						Cancel
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</>)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

	try {
		const { params } = context;

		if (!params || typeof params.id != "string") {
			throw new Error("no paramters passed")
		}

		const event = await prisma.event.findUnique({
			where: {
				id: params.id
			},
			include: {
				user: true,
			}
		});

		const userResponses = await prisma.eventResponse.findMany({
			where: {
				eventId: params.id,
			},
			include: {
				user: true,
			}
		})

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as Event, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { event: [] }
		}
	}
}
