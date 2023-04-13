import { prisma } from "lib/db";
import { Event, EventResponse, TimePair } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/id.module.scss"
import { add, format, isWithinInterval, parseISO } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { debounce } from "debounce";
import { v4 as uuidv4 } from "uuid";
import { scheduler } from "timers/promises";


interface EventProps {
	event: Event
	userResponses: EventResponse[];
	localSchedule: TimePair[];
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

export default function ViewEvent({ event, userResponses, localSchedule }: EventProps) {
	const { data: session } = useSession();
	const [scheduleState, setScheduleState] = useState(localSchedule)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	const [isDraggingOrResizing, setIsDraggingOrResizing] = useState(false);
	let designWidth = designSize * currentZoom

	const [currentTimePair, setCurrentTimePair] = useState<string | undefined>();
	const [showMenu, setShowMenu] = useState({ x: 0, y: 0, showing: false, currentId: "" })

	const containerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);
	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, ref: containerRef })
	const bounds = { start: new Date(event.startDateTime), end: new Date(event.endDateTime) }

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			const element = contextMenuRef?.current;
			if (!element || element.contains((event?.target as Node) || null)) {
				return;
			}

			if (showMenu.showing) {
				setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
			}
		}

		document.addEventListener("click", handleClick)
		return () => {
			document.removeEventListener("click", handleClick)
		}
	}, [showMenu])

	async function handleSave() {
		//TODO save on page reload / page transition
		try {
			let response = await fetch("http://localhost:3000/api/updateEventResponses", {
				method: "POST",
				body: JSON.stringify({
					localUserResponses: localSchedule
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
	}

	async function handleCreate(start: Date, end: Date) {
		const newArray = Array.from(scheduleState);
		newArray.push({ start: start, end: end, id: uuidv4() })
		setScheduleState(newArray);
	}

	async function handleDelete(idToDelete: string) {
		setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
		setScheduleState(scheduleState.filter(r => r.id !== idToDelete));
	}

	function handleDraggingOrResizing(value: boolean) {
		setTimeout(() => {
			setIsDraggingOrResizing(value);
		});

		if (value && showMenu.showing) {
			setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
		}
	}

	function checkForOverlap(table: Array<TimePair>, start: Date, end: Date) {
		const overlappingResponse = table.find(s => {
			const isStartOverlapping = isWithinInterval(start, { start: s.start, end: s.end })
			const isEndOverlapping = isWithinInterval(end, { start: s.start, end: s.end })

			if (isStartOverlapping || isEndOverlapping) {
				return true;
			}
		});
		return overlappingResponse;
	}

	function onResponseMouseOver(responseId: string | undefined) {
		setCurrentTimePair(responseId);
	}

	function handleUpdate(id: string, newStart: Date, newEnd: Date) {
		const filteredUserResponses = scheduleState.filter(s => s.id !== id);
		const overlappingEvent = checkForOverlap(filteredUserResponses, newStart, newEnd);
		console.log(overlappingEvent);

		//TODO add modal asking if the responses should be merged "Do you want to merge these two time cards ?"

		filteredUserResponses.push({ id: id, start: newStart, end: newEnd })
		setScheduleState(filteredUserResponses);
	}

	function onClickHandler(e: React.MouseEvent) {
		if (showMenu.showing) {
			setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
			return
		}

		if (currentTimePair && !isDraggingOrResizing) {
			setTimeout(() => {
				setShowMenu({ x: e.clientX, y: e.clientY, showing: true, currentId: currentTimePair })
			}, 100);
		}
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
			handleCreate(startTime, endTime)
		}
	}

	return (<>
		<div className={styles.wrapper}>
			<div className={styles.userInfo}>users</div>
			<div className={styles.timelineContainer}>
				<div className={styles.timelineTools}>
					<div className={styles.magnify}>
						<div className={styles.buttonLeft} onClick={handleZoomIn}><FiZoomIn className={styles.icon} /></div>
						<div className={styles.buttonRight} onClick={handleZoomOut}><FiZoomOut className={styles.icon} /></div>
					</div>
					{/* TODO display date */}
				</div>

				<div className={styles.scrollable} onClick={onClickHandler}>
					<div className={styles.content} style={{ width: designWidth }} ref={containerRef} >
						<TimelineNumbers start={event.startDateTime} end={event.endDateTime} />
						<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick}>
							{scheduleState.map((schedule: TimePair, index: number) => {
								return <ResizableTimeCard
									key={schedule.id}
									schedule={schedule}
									timeline={timeline}
									updateHandler={handleUpdate}
									onMouseOverHandler={onResponseMouseOver}
									dragAndResizeHandler={handleDraggingOrResizing}
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
				<h2>{format(parseISO(event.startDateTime, { additionalDigits: 0 }), "dd/MM/yy HH:mm")}</h2>
				<h2>{format(parseISO(event.endDateTime, { additionalDigits: 0 }), "dd/MM/yy HH:mm")}</h2>
			</div>
		</div>

		{showMenu.showing && <div style={{ top: `${showMenu.y}px`, left: `${showMenu.x}px` }} className={styles.contextMenu} ref={contextMenuRef}>
			<ul className={styles.contextMenuItem} onClick={() => {
				handleDelete(showMenu.currentId)
			}}>Delete</ul>
			<ul className={styles.contextMenuItem} onClick={() => {
				setShowMenu({ x: 0, y: 0, showing: false, currentId: "" })
			}}>Cancel</ul>
		</div>}
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

		const parsedLocalUserResponse = JSON.parse(JSON.stringify(localUserResponse)) as EventResponse
		var schedule: TimePair[] = [];
		if (parsedLocalUserResponse) {
			schedule = parsedLocalUserResponse.schedule
		}

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as Event, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[], localSchedule: schedule },
		};
	} catch (e) {
		console.error(e);
	}
}
