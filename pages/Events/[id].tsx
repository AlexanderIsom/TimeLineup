import { EventData, EventResponse, TimeDuration } from "types/Events"
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
import * as Avatar from "@radix-ui/react-avatar"
import { RxScissors, RxZoomIn, RxZoomOut, RxCircleBackslash } from "react-icons/rx"
import { TbTrashX } from "react-icons/tb"

import dropdownStyle from "styles/Components/Dropdown.module.scss"
import EventDetails from "components/EventDetails";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

interface EventProps {
	event: EventData
	userResponses: EventResponse[];
}

export interface LocalDataObject {
	rejected: boolean,
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
	if (userResponses === undefined) {
		userResponses = []
	}

	const startDate = new Date(event.startDateTime)
	const endDate = new Date(event.endDateTime)

	const router = useRouter();
	const [scheduleState, setScheduleState] = useState<TimeDuration[]>([])
	const [rejected, setRejected] = useState<boolean>();
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
		localStorage.setItem(event._id.toString(), JSON.stringify({ rejected: rejected, schedule: scheduleState }))
	}, [event, scheduleState, rejected])

	// for demo site use only
	userResponses.forEach(response => {
		response.schedule.forEach(item => {
			item.start = new Date(item.start)

			item.start.setDate(startDate.getDate())
			item.start.setMonth(startDate.getMonth())
			item.start.setFullYear(startDate.getFullYear())

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


		const localDataString = localStorage.getItem(event._id.toString());

		const localData: LocalDataObject = localDataString !== null ? JSON.parse(localDataString) : {};
		const schedule = localData.schedule !== undefined ? localData.schedule : [];
		const rejected = localData.rejected;

		if (!hasLoaded) {
			if (scheduleState.length === 0 && schedule.length !== 0) {
				setScheduleState(schedule)
			}
			if (rejected) {
				setRejected(localData.rejected)
			}
			setHasLoaded(true)
		}


		return () => {
			window.removeEventListener("beforeunload", handleUnload)
			router.events.off('routeChangeStart', handleSave)
		}
	}, [setRejected, showMenu, router, handleSave, event, setScheduleState, scheduleState, hasLoaded, setHasLoaded])


	function handleCreate(start: Date, duration: number, table: TimeDuration[]): TimeDuration[] {
		const newSchedule = Array.from(table);
		newSchedule.push({ start: start, duration: duration, id: uuidv4() })
		return newSchedule;
	}

	function handleDelete(idToDelete: string, table: TimeDuration[]): TimeDuration[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function handleSplit(idToSplit: string, splitAtX: number, table: TimeDuration[]): TimeDuration[] {
		var bounds = containerRef.current!.getBoundingClientRect();
		const currentTimeDuration = table.find(r => r.id === idToSplit)
		if (currentTimeDuration) {
			const startTime = currentTimeDuration.start;
			const endTime = addMinutes(startTime, currentTimeDuration.duration)
			const midTime = roundToNearestMinutes(timeline.toDate(splitAtX - bounds.left), { nearestTo: 15 });
			const midDuration = differenceInMinutes(midTime, startTime);
			const endDuration = differenceInMinutes(endTime, midTime)

			let newSchedule = handleDelete(idToSplit, table);
			newSchedule = handleCreate(startTime, midDuration, newSchedule);
			newSchedule = handleCreate(midTime, endDuration, newSchedule);
			return newSchedule
		}
		return table
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
			const newSchedule = handleCreate(startTime, 60, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	const handleToggleReject = () => {
		setRejected(!rejected);
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
						return <div key={eventResponse.user._id} className={styles.userItem}>
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
							<div><button onClick={handleToggleReject}>reject</button></div>
						</div>
					</div>
					<div className={styles.timelineContent} onScroll={onContentScroll} >

						<div className={`${styles.gridBackground} `} style={{
							width: designWidth,
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
										onClickHandler={onClickHandler}
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
			<EventDetails event={event} userResponses={userResponses} localResponse={scheduleState} localRejected={rejected} />
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

		const client = await clientPromise
		const db = client.db("TimeLineupDemo")

		const eventData = await db.collection("Event").aggregate([
			{ $match: { _id: new ObjectId(params.id) } }, { $limit: 1 }, {
				$lookup: {
					from: 'User', // The collection to perform the join with
					localField: 'userId', // The field from the posts collection
					foreignField: '_id', // The field from the users collection
					as: 'user' // The field where the joined document will be stored
				},
			}, { $unwind: "$user" }]).toArray()

		const userResponses = await db.collection("EventResponse").aggregate([
			{ $match: { eventId: new ObjectId(params.id) } }, {
				$lookup: {
					from: 'User', // The collection to perform the join with
					localField: 'userId', // The field from the posts collection
					foreignField: '_id', // The field from the users collection
					as: 'user' // The field where the joined document will be stored
				},
			}, { $unwind: "$user" }]).toArray();

		// console.log(userResponses);

		return {
			props: { event: JSON.parse(JSON.stringify(eventData[0])) as EventData, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { event: [] }
		}
	}
}
