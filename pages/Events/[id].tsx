import { EventData, EventResponse, ResponseState, TimeDuration } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/id.module.scss"
import { add, addMinutes, differenceInMinutes, isEqual, isWithinInterval, max, min, roundToNearestMinutes, setDate } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { RxScissors, RxZoomIn, RxZoomOut, RxCircleBackslash } from "react-icons/rx"
import { TbTrashX } from "react-icons/tb"

import dropdownStyle from "styles/Components/Dropdown.module.scss"
import EventDetails from "components/EventDetails";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import Image from "next/image";

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

const roundNearest = (value: number, nearest: number): number => Math.round(value / nearest) * nearest;

export default function ViewEvent({ event, userResponses }: EventProps) {

	const router = useRouter();
	const [scheduleState, setScheduleState] = useState<TimeDuration[]>([])
	const [responseState, setResponseState] = useState<ResponseState>(ResponseState.pending);
	const [hasLoaded, setHasLoaded] = useState<boolean>(false)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	let designWidth = designSize * currentZoom
	const [showMenu, setShowMenu] = useState<menu>({ showing: false })
	const containerRef = useRef<HTMLDivElement>(null);
	const userContainerRef = useRef<HTMLDivElement>(null);

	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, ref: containerRef })
	const bounds = { start: event.startDateTime, end: event.endDateTime }
	const [contentLastScroll, setContentLastScroll] = useState(0);

	const handleSave = useCallback(async () => {
		localStorage.setItem(event._id.toString(), JSON.stringify({ responseState: responseState, schedule: scheduleState }))
	}, [event, scheduleState, responseState])

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


		return () => {
			window.removeEventListener("beforeunload", handleUnload)
			router.events.off('routeChangeStart', handleSave)
		}
	}, [showMenu, router, handleSave, event, scheduleState, hasLoaded, responseState])


	function handleCreate(start: Date, duration: number, table: TimeDuration[]): TimeDuration[] {
		if (responseState !== ResponseState.attending) {
			setResponseState(ResponseState.attending)
		}
		const newSchedule = Array.from(table);
		newSchedule.push({ start: start, duration: duration, id: uuidv4() })
		return newSchedule;
	}

	function handleDelete(idToDelete: string, table: TimeDuration[]): TimeDuration[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function handleSplit(idToSplit: string) {
		const currentTimeDuration = scheduleState.find(r => r.id === idToSplit)
		if (currentTimeDuration && currentTimeDuration.duration >= 60) {
			const startTime = new Date(currentTimeDuration.start);
			const halfDuration = roundNearest(currentTimeDuration.duration / 2, 15)
			const midTime = roundToNearestMinutes(addMinutes(startTime, halfDuration), { nearestTo: 15 });

			let newSchedule = handleDelete(idToSplit, scheduleState);
			newSchedule = handleCreate(startTime, halfDuration, newSchedule);
			newSchedule = handleCreate(midTime, halfDuration, newSchedule);
			setScheduleState(newSchedule);
		}
	}

	function checkForOverlap(table: Array<TimeDuration>, start: Date, end: Date): Array<TimeDuration> {
		const overlappingResponses = table.filter(schedule => {
			schedule.start = new Date(schedule.start);
			const scheduleEnd = addMinutes(schedule.start, schedule.duration);
			const isStartOverlapping = !isEqual(start, scheduleEnd) && isWithinInterval(start, { start: schedule.start, end: scheduleEnd })
			const isEndOverlapping = !isEqual(end, schedule.start) && isWithinInterval(end, { start: schedule.start, end: scheduleEnd })
			const isAllOverlapping = start < schedule.start && end > scheduleEnd;

			if (isStartOverlapping || isEndOverlapping || isAllOverlapping) {
				return true;
			}
		});
		return overlappingResponses;
	}

	function handleUpdate(id: string, newStart: Date, newDuration: number) {
		let filteredUserResponses = scheduleState.filter(s => s.id !== id);
		const overlappingEvents = checkForOverlap(filteredUserResponses, newStart, addMinutes(newStart, newDuration));

		if (overlappingEvents.length > 0) {
			const startTimes = overlappingEvents.map(e => e.start)
			const endingTimes = overlappingEvents.map(e => addMinutes(e.start, e.duration))
			startTimes.push(newStart);
			endingTimes.push(addMinutes(newStart, newDuration))
			const start = min(startTimes)
			const end = max(endingTimes)

			overlappingEvents.forEach(event => {
				filteredUserResponses = handleDelete(event.id, filteredUserResponses);
			});
			filteredUserResponses = handleCreate(start, differenceInMinutes(end, start), filteredUserResponses)
		} else {
			filteredUserResponses.push({ id: id, start: newStart, duration: newDuration })
		}

		setScheduleState(filteredUserResponses);
	}

	function onContext(e: React.MouseEvent, pairId: string) {
		e.preventDefault();
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
			const newSchedule = handleCreate(startTime, 60, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	const onContentScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		if (e.currentTarget.scrollTop !== contentLastScroll) {
			userContainerRef.current!.scrollTop = e.currentTarget.scrollTop;
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
				<div className={styles.userContainer} ref={userContainerRef}>
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
					<div className={styles.timelineContent} onScroll={onContentScroll} >
						<div className={`${styles.gridBackground} `} style={{
							width: `${designWidth}px`,
							backgroundSize: `${timeline.getWidth() / timeline.hoursCount}px`
						}} ref={containerRef} >
							<TimelineNumbers start={new Date(event.startDateTime)} end={new Date(event.endDateTime)} />
							<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick}>
								{scheduleState.map((schedule: TimeDuration) => {
									return <ResizableTimeCard
										key={schedule.id}
										schedule={schedule}
										timeline={timeline}
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
											return <StaticTimeCard key={sch.id} schedule={sch} timeline={timeline} />
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
							handleSplit(showMenu.currentId!)
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

		const userResponses = await db.collection("EventResponse").aggregate([
			{ $match: { eventId: new ObjectId(params.id) } }, {
				$lookup: {
					from: 'User',
					localField: 'userId',
					foreignField: '_id',
					as: 'user'
				},
			}, { $unwind: "$user" }]).toArray() as EventResponse[];

		const startDate = new Date(event.startDateTime);

		// for demo site use only
		userResponses.forEach(response => {
			response.schedule.forEach(item => {
				item.start = new Date(item.start)

				item.start.setDate(startDate.getDate())
				item.start.setMonth(startDate.getMonth())
				item.start.setFullYear(startDate.getFullYear())

			});
		});

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
