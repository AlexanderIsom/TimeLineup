import { prisma } from "lib/db";
import { Event, EventResponse, TimePair } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/id.module.scss"
import { add, format, isEqual, isWithinInterval, max, min, parseISO, roundToNearestMinutes } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
	ZoomInIcon,
	ZoomOutIcon
} from '@radix-ui/react-icons';

interface EventProps {
	event: Event
	userResponses: EventResponse[];
	localResponse: EventResponse;
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

export default function ViewEvent({ event, userResponses, localResponse }: EventProps) {
	event.startDateTime = new Date(event.startDateTime);
	event.endDateTime = new Date(event.endDateTime);

	const router = useRouter();
	const { data: session } = useSession();
	const [scheduleState, setScheduleState] = useState(localResponse.schedule)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	let designWidth = designSize * currentZoom
	const [showMenu, setShowMenu] = useState<menu>({ showing: false })
	const containerRef = useRef<HTMLDivElement>(null);

	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, ref: containerRef })
	const bounds = { start: new Date(event.startDateTime), end: new Date(event.endDateTime) }

	const handleSave = useCallback(async () => {
		//TODO save on page reload / page transition
		try {
			let response = await fetch("http://localhost:3000/api/updateEventResponses", {
				method: "POST",
				body: JSON.stringify({
					schedule: scheduleState,
					responseId: localResponse.id,
					eventId: event.id,
					userId: session?.user.id
				}),
				headers: {
					Accept: "application/json, text/plaion, */*",
					"Content-Type": "application/json",
				},
			});
			response = await response.json();
		} catch (errorMessage: any) {
			console.log(errorMessage);
		}
	}, [event, scheduleState, session, localResponse])

	useEffect(() => {
		function handleUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			handleSave();
		}

		window.addEventListener("beforeunload", handleUnload)
		router.events.on('routeChangeStart', handleSave)

		return () => {
			window.removeEventListener("beforeunload", handleUnload)
			router.events.off('routeChangeStart', handleSave)

		}
	}, [showMenu, router, handleSave])


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

	function checkForOverlap(table: Array<TimePair>, start: Date, end: Date) {
		const overlappingResponse = table.find(s => {
			s.start = new Date(s.start);
			s.end = new Date(s.end);
			const isStartOverlapping = !isEqual(start, s.end) && isWithinInterval(start, { start: s.start, end: s.end })
			const isEndOverlapping = !isEqual(end, s.start) && isWithinInterval(end, { start: s.start, end: s.end })

			if (isStartOverlapping || isEndOverlapping) {
				return true;
			}
		});
		return overlappingResponse;
	}

	function handleUpdate(id: string, newStart: Date, newEnd: Date) {
		let filteredUserResponses = scheduleState.filter(s => s.id !== id);
		const overlappingEvent = checkForOverlap(filteredUserResponses, newStart, newEnd);

		if (overlappingEvent !== undefined) {
			const start = min([newStart, overlappingEvent.start])
			const end = max([newEnd, overlappingEvent.end])
			filteredUserResponses = handleDelete(overlappingEvent.id, filteredUserResponses);
			filteredUserResponses = handleCreate(start, end, filteredUserResponses)

		} else {
			filteredUserResponses.push({ id: id, start: newStart, end: newEnd })
		}

		setScheduleState(filteredUserResponses);
	}

	function hideContext() {
		setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
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

		if (checkForOverlap(scheduleState, startTime, endTime) === undefined) {
			const newSchedule = handleCreate(startTime, endTime, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	return (<>
		<div className={styles.wrapper}>
			<div className={styles.userInfo}>users</div>
			<div className={styles.timelineContainer}>
				<div className={styles.timelineTools}>
					<div className={styles.magnify}>
						<div className={styles.buttonLeft} onClick={handleZoomIn}>< ZoomInIcon className={styles.icon} /></div>
						<div className={styles.buttonRight} onClick={handleZoomOut}><ZoomOutIcon className={styles.icon} /></div>
					</div>
					{/* TODO display date */}
				</div>

				<div className={styles.scrollable}>
					<div className={`${styles.content} ${styles.gridBackground} `} style={{
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
									hideContextHandler={hideContext}
									bounds={bounds}
								/>
							})}
						</div>
						<div className={styles.userResponses}>
							{userResponses.map((eventResponse: EventResponse, index: number) => {
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

			<div className={styles.eventInfo}>
				<h1>{event.title}</h1>
				<h2>{event.userId}</h2>
				<h2>{format(event.startDateTime, "dd/MM/yy HH:mm")}</h2>
				<h2>{format(event.endDateTime, "dd/MM/yy HH:mm")}</h2>
			</div>
		</div>

		<DropdownMenu.Root open={showMenu.showing} onOpenChange={(open: boolean) => { setShowMenu({ showing: open }) }}>
			<DropdownMenu.Portal>
				<DropdownMenu.Content style={{ top: `${showMenu.y}px`, left: `${showMenu.x}px`, position: "absolute", background: "gray", width: "50px", height: "50px" }}>
					<DropdownMenu.Item onSelect={() => {
						const newSchedule = handleDelete(showMenu.currentId!, scheduleState)
						setScheduleState(newSchedule);
					}}>
						Delete
					</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={() => {
						const newSchedule = handleSplit(showMenu.currentId!, showMenu.x!, scheduleState)
						setScheduleState(newSchedule);
					}}>
						Split
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</>)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const session = await getServerSession(context.req, context.res, authOptions);
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
				NOT: {
					userId: session?.user.id
				}
			},
			include: {
				user: true,
			}
		})

		const localUserResponse = await prisma.eventResponse.findFirst({
			where: {
				eventId: params.id,
				userId: session?.user.id,
			}
		})

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as Event, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[], localResponse: JSON.parse(JSON.stringify(localUserResponse)) as EventResponse },
		};
	} catch (e) {
		console.error(e);
	}
}
