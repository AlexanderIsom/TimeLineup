import { prisma } from "lib/db";
import { Event, EventResponse } from "types/Events"
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


interface EventProps {
	event: Event
	userResponses: EventResponse[];
	localUserResponses: EventResponse[];
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

export default function ViewEvent({ event, userResponses, localUserResponses }: EventProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const [localResponsesState, setLocalResponsesState] = useState(localUserResponses)

	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	const [isDraggingOrResizing, setIsDraggingOrResizing] = useState(false);
	let designWidth = designSize * currentZoom

	const [currentMousedOverResponse, setCurrentMousedOverResponse] = useState<EventResponse | undefined>();
	const [targetResponse, setTargetResponse] = useState<EventResponse>();
	const [showMenu, setShowMenu] = useState({ x: 0, y: 0, showing: false })

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
				setShowMenu({ x: 0, y: 0, showing: false })
				setTargetResponse(undefined);
			}
		}

		document.addEventListener("click", handleClick)
		return () => {
			document.removeEventListener("click", handleClick)
		}
	}, [showMenu])

	async function handleSave() {
		try {
			let response = await fetch("http://localhost:3000/api/updateEventResponses", {
				method: "POST",
				body: JSON.stringify({
					localUserResponses
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
		//TODO change to create on save
		try {
			let response = await fetch("http://localhost:3000/api/createEventResponse", {
				method: "POST",
				body: JSON.stringify({
					eventId: event.id, userId: session?.user.id, startDateTime: start, endDateTime: end
				}),
				headers: {
					Accept: "application/json, text/plaion, */*",
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				const newReponse = await response.json() as EventResponse;
				const newArray = Array.from(localResponsesState);
				newArray.push(newReponse)
				setLocalResponsesState(newArray);
			}
		} catch (errorMessage: any) {
			console.log(errorMessage);
		}
	}

	async function handleDelete() {
		setShowMenu({ x: 0, y: 0, showing: false })

		try {
			const previousState = Array.from(localResponsesState);
			setLocalResponsesState(localResponsesState.filter(r => r.id !== targetResponse?.id));
			setTargetResponse(undefined);
			let response = await fetch("http://localhost:3000/api/deleteEventResponse", {
				method: "POST",
				body: JSON.stringify({
					event: targetResponse
				}),
				headers: {
					Accept: "application/json, text/plaion, */*",
					"Content-Type": "application/json",
				},
			});
			response = await response.json();
			if (response.status !== 200) {
				setLocalResponsesState(previousState);
			}
		} catch (errorMessage: any) {
			console.log(errorMessage);
		}
	}

	function handleDraggingOrResizing(value: boolean) {
		setTimeout(() => {
			setIsDraggingOrResizing(value);
		});

		if (value && showMenu.showing) {
			setShowMenu({ x: 0, y: 0, showing: false })
		}
	}

	function checkForOverlap(table: EventResponse[], start: Date, end: Date) {
		const overlappingResponse = table.find(r => {
			const resultStart = new Date(r.startDateTime);
			const resultEnd = new Date(r.endDateTime);
			const isStartOverlapping = isWithinInterval(start, { start: resultStart, end: resultEnd })
			const isEndOverlapping = isWithinInterval(end, { start: resultStart, end: resultEnd })

			if (isStartOverlapping || isEndOverlapping) {
				return true;
			}
		});
		return overlappingResponse;
	}

	function onResponseMouseOver(response: EventResponse | undefined) {
		setCurrentMousedOverResponse(response);
	}

	function handleUpdate(id: string, start: Date, end: Date) {
		const filteredUserResponses = localUserResponses.filter(r => r.id !== id);
		const overlappingEvent = checkForOverlap(filteredUserResponses, start, end);

		//TODO add modal asking if the responses should be merged "Do you want to merge these two time cards ?"

		const response = localUserResponses.find(r => r.id === id)
		if (response) {
			response.startDateTime = start;
			response.endDateTime = end;
		}
	}

	function onClickHandler(e: React.MouseEvent) {
		if (showMenu.showing) {
			setShowMenu({ x: 0, y: 0, showing: false })
			return
		}

		if (currentMousedOverResponse && !isDraggingOrResizing) {
			setTimeout(() => {
				setTargetResponse(currentMousedOverResponse);
				setShowMenu({ x: e.clientX, y: e.clientY, showing: true })
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

		if (checkForOverlap(localUserResponses, startTime, endTime) === undefined) {
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
					<div>
						<button className={styles.saveButton} onClick={handleSave}>save</button>
					</div>
				</div>

				<div className={styles.scrollable} onClick={onClickHandler}>
					<div className={styles.content} style={{ width: designWidth }} ref={containerRef} >
						<TimelineNumbers start={event.startDateTime} end={event.endDateTime} />
						<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick}>
							{localResponsesState.map((response: EventResponse, index: number) => {
								return <ResizableTimeCard
									key={response.id}
									response={response}
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
								return <StaticTimeCard key={index} event={eventResponse} timeline={timeline} />
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
			<ul className={styles.contextMenuItem} onClick={handleDelete}>Delete</ul>
			<ul className={styles.contextMenuItem} onClick={() => {
				setShowMenu({ x: 0, y: 0, showing: false })
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

		//TODO change event responeses so they are responses per use instead of individual responses

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

		const localUserResponses = await prisma.eventResponse.findMany({
			where: {
				eventId: params.id,
				userId: session?.user.id,
			},
			include: {
				user: true,
			}
		})

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as Event, userResponses: JSON.parse(JSON.stringify(userResponses)) as EventResponse[], localUserResponses: JSON.parse(JSON.stringify(localUserResponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
	}
}
