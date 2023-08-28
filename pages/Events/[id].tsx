import { EventData, EventResponse, ResponseState, TimeDuration } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/Components/id.module.scss"
import { addDays, addMinutes, addWeeks, roundToNearestMinutes, setDate, startOfWeek } from "date-fns";
import TimelineNumbers from "components/TimelineNumber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { RxZoomIn, RxZoomOut, RxCircleBackslash } from "react-icons/rx"
import { TbTrashX } from "react-icons/tb"

import dropdownStyle from "styles/Components/Dropdown.module.scss"
import EventDetails from "components/EventDetails";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import Image from "next/image";
import MathUtils from "utils/MathUtils";
import Timeline from "utils/Timeline";

interface EventProps {
	event: EventData
	userResponses: EventResponse[];
}

export interface LocalDataObject {
	responseState: ResponseState,
	schedule: TimeDuration[]
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

export default function ViewEvent({ event, userResponses }: EventProps) {
	const startDateTime = new Date(event.startDateTime);
	const endDateTime = addMinutes(startDateTime, event.duration);
	const router = useRouter();
	const [scheduleState, setScheduleState] = useState<TimeDuration[]>([])
	const [responseState, setResponseState] = useState<ResponseState>(ResponseState.pending);
	const [hasLoaded, setHasLoaded] = useState<boolean>(false)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	const [designWidth, setDesignWidth] = useState(designSize * currentZoom)
	const [showMenu, setShowMenu] = useState<menu>({ showing: false })
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const timelineScrollingContainerRef = useRef<HTMLDivElement>(null);
	const attendingUsersContainerRef = useRef<HTMLDivElement>(null);

	new Timeline(startDateTime, event.duration, designWidth, 5)
	const bounds = { start: startDateTime, end: endDateTime }
	const [contentLastScroll, setContentLastScroll] = useState(0);

	const handleSave = useCallback(async () => {
		localStorage.setItem(event._id.toString(), JSON.stringify({ responseState: responseState, schedule: scheduleState }))
	}, [event, scheduleState, responseState])

	const attendingUsers = userResponses.filter((response) => {
		return response.state === ResponseState.attending;
	})


	useEffect(() => {
		function handleUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			handleSave();
		}

		window.addEventListener("beforeunload", handleUnload)
		router.events.on('routeChangeStart', handleSave)

		const localDataString = localStorage.getItem(event._id.toString());

		const localData: LocalDataObject = localDataString !== null ? JSON.parse(localDataString) : {};
		const schedule = localData.schedule !== undefined ? localData.schedule : [];
		const responseStateData = localData.responseState;

		if (!hasLoaded) {
			if (scheduleState.length === 0 && schedule.length !== 0) {
				setScheduleState(schedule)
			}
			if (responseStateData !== undefined) {
				setResponseState(responseStateData)
			}
			setHasLoaded(true)
		}

		const timelineContainer = timelineScrollingContainerRef.current
		var resizeObserver: ResizeObserver | undefined;

		if (timelineContainer) {
			resizeObserver = new ResizeObserver(([element]) => {
				setDesignWidth(Math.max(element.contentRect.width, designWidth));
			})
			resizeObserver.observe(timelineContainer);
		}


		return () => {
			window.removeEventListener("beforeunload", handleUnload)
			router.events.off('routeChangeStart', handleSave)
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		}
	}, [showMenu, router, handleSave, event, scheduleState, hasLoaded, responseState, designWidth])


	function handleCreate(offsetFromStart: number, duration: number, table: TimeDuration[]): TimeDuration[] {
		if (responseState !== ResponseState.attending) {
			setResponseState(ResponseState.attending)
		}
		const newSchedule = Array.from(table);
		newSchedule.push({ offsetFromStart: offsetFromStart, duration: duration, id: uuidv4() })
		return newSchedule;
	}

	function handleDelete(idToDelete: string, table: TimeDuration[]): TimeDuration[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function findOverlappingResponses(table: Array<TimeDuration>, offsetFromStart: number, duration: number): Array<TimeDuration> {
		const overlappingResponses = table.filter(item => {
			const startIsWithin = MathUtils.isBetween(item.offsetFromStart, offsetFromStart, offsetFromStart + duration)
			const endIsWithin = MathUtils.isBetween(item.offsetFromStart + duration, offsetFromStart, offsetFromStart + duration)

			if (startIsWithin || endIsWithin) {
				return true;
			}
		});
		return overlappingResponses;
	}

	function handleUpdate(id: string, offsetFromStart: number, duration: number) {
		let filteredUserResponses = scheduleState.filter(s => s.id !== id);
		const overlappingEvents = findOverlappingResponses(filteredUserResponses, offsetFromStart, duration);

		if (overlappingEvents.length > 0) {
			const startTimes = overlappingEvents.map(e => e.offsetFromStart)
			const endTimes = overlappingEvents.map(e => e.offsetFromStart + e.duration)
			startTimes.push(offsetFromStart);
			endTimes.push(offsetFromStart + duration)
			const start = Math.min(...startTimes)
			const end = Math.max(...endTimes)

			overlappingEvents.forEach(event => {
				filteredUserResponses = handleDelete(event.id, filteredUserResponses);
			});
			filteredUserResponses = handleCreate(start, end - start, filteredUserResponses)
		} else {
			filteredUserResponses.push({ id: id, offsetFromStart: offsetFromStart, duration: duration })
		}

		setScheduleState(filteredUserResponses);
	}

	function onContext(e: React.MouseEvent, pairId: string) {
		e.preventDefault();
		setShowMenu({ x: e.clientX, y: e.clientY, showing: true, currentId: pairId })
	}

	function handleZoomOut() {
		const newZoom = EnumX.of(ZoomLevels).previous(currentZoom)
		const width = timelineScrollingContainerRef.current?.getBoundingClientRect().width !== undefined ? timelineScrollingContainerRef.current?.clientWidth : 0
		setDesignWidth(Math.max(width, designSize * newZoom));
		setCurrentZoom(newZoom);
	}

	function handleZoomIn() {
		const newZoom = EnumX.of(ZoomLevels).next(currentZoom)
		setDesignWidth(designSize * newZoom);
		setCurrentZoom(newZoom);
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		var bounds = timelineContainerRef.current!.getBoundingClientRect();
		const width = e.clientX - bounds.left;
		const offsetFromStart = MathUtils.roundToNearest(Timeline.xPositionToMinutes(width), 15)
		const duration = 60;

		if (findOverlappingResponses(scheduleState, offsetFromStart, duration).length === 0) {
			const newSchedule = handleCreate(offsetFromStart, duration, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	const onContentScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		if (e.currentTarget.scrollTop !== contentLastScroll) {
			attendingUsersContainerRef.current!.scrollTop = e.currentTarget.scrollTop;
			setContentLastScroll(e.currentTarget.scrollTop);
		}
	}

	const onResponseStateChange = (newState: ResponseState) => {
		setResponseState(newState);

		if (newState !== ResponseState.attending) {
			setScheduleState([])
		}
	}

	return (<>
		<div className={styles.wrapper}>
			<div className={styles.scrollable}>
				<div className={styles.userContainer} ref={attendingUsersContainerRef}>
					<div className={styles.userItem}>
						<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
						<div className={styles.userName}>Demo user</div>
					</div>

					{attendingUsers.map((eventResponse: EventResponse, index: number) => {
						return <div key={eventResponse.user._id} className={styles.userItem}>
							<Image className={styles.avatarRoot} src={`/UserIcons/${eventResponse.user.image}.png`} alt={eventResponse.user.name} width={500} height={500} />
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
					<div className={styles.timelineContent} onScroll={onContentScroll} ref={timelineScrollingContainerRef}>
						<div style={{
							width: `${designWidth}px`,
							backgroundSize: `${designWidth / Math.round(event.duration / 60)}px`
						}} ref={timelineContainerRef} className={`${styles.gridBackground} `} >
							<TimelineNumbers start={new Date(startDateTime)} end={new Date(endDateTime)} />
							<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick}>
								{scheduleState.map((schedule: TimeDuration) => {
									return <ResizableTimeCard
										key={schedule.id}
										schedule={schedule}
										updateHandler={handleUpdate}
										onContext={onContext}
										bounds={bounds}
									/>
								})}
							</div>
							<div className={styles.userResponses}>
								{attendingUsers.map((eventResponse: EventResponse, index: number) => {
									return <div key={index} className={styles.staticRow}>{
										eventResponse.schedule.map((sch: TimeDuration) => {
											return <StaticTimeCard startDateTime={startDateTime} key={sch.id} schedule={sch} />
										})
									}</div>
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
			<EventDetails event={event} userResponses={userResponses} responseState={responseState} onStateChange={(newState: ResponseState) => { onResponseStateChange(newState) }} />
		</div>

		<DropdownMenu.Root open={showMenu.showing} onOpenChange={(open: boolean) => { setShowMenu({ showing: open }) }}>
			<DropdownMenu.Portal >
				<DropdownMenu.Content className={dropdownStyle.content} style={{ top: `${showMenu.y}px`, left: `${showMenu.x}px`, position: "absolute", zIndex: 10 }}>
					<DropdownMenu.Label className={dropdownStyle.label} >Tools</DropdownMenu.Label>
					<DropdownMenu.Separator className={dropdownStyle.sepparator} />
					<DropdownMenu.Group className={dropdownStyle.group}>
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

		const client = await clientPromise
		const db = client.db("TimeLineupDemo")

		const eventData = await db.collection("Event").aggregate([
			{ $match: { _id: new ObjectId(params.id) } }, { $limit: 1 }, {
				$lookup: {
					from: 'User',
					localField: 'userId',
					foreignField: '_id',
					as: 'user'
				},
			}, { $unwind: "$user" }]).toArray();

		const event = eventData[0] as EventData;

		const eventDate = addDays(startOfWeek(addWeeks(new Date(), event.weekOffset)), event.day);

		event.startDateTime = new Date(event.startDateTime);

		event.startDateTime.setDate(eventDate.getDate())
		event.startDateTime.setMonth(eventDate.getMonth())
		event.startDateTime.setFullYear(eventDate.getFullYear())

		const userResponses = await db.collection("EventResponse").aggregate([
			{ $match: { eventId: new ObjectId(params.id) } }, {
				$lookup: {
					from: 'User',
					localField: 'userId',
					foreignField: '_id',
					as: 'user'
				},
			}, { $unwind: "$user" }]).toArray() as EventResponse[];

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as EventData, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { event: [] }
		}
	}
}
