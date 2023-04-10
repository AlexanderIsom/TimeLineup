import { prisma } from "lib/db";
import { Event, EventResponse } from "types/Events"
import ResizableTimeCard from "components/ResizableTimeCard";
import styles from "styles/id.module.scss"
import { format, parseISO } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useRef, useState } from "react";
import StaticTimeCard from "components/StaticTimeCard";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import TranslucentTimeCard from "components/TranslucentTimeCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


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
	const [currentZoom, setCurrentZoom] = useState(1);
	const designSize = 1920
	let designWidth = designSize * currentZoom
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollingContainerRef = useRef<HTMLDivElement>(null);
	const [isAdding, setIsAdding] = useState(false);

	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, ref: containerRef })

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
			response = await response.json();
			if (response.status === 200) {
				setIsAdding(false);
				router.reload();
			}
		} catch (errorMessage: any) {
			console.log(errorMessage);
		}
	}

	function handleUpdate(id: string, start: Date, end: Date) {
		const response = localUserResponses.find(r => r.id === id)
		if (response) {
			response.startDateTime = start;
			response.endDateTime = end;
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

	function handleAdd() {
		setIsAdding(!isAdding);
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
						<button className={styles.addButton} onClick={handleAdd}>Add</button>
					</div>
				</div>

				<div className={styles.scrollable} ref={scrollingContainerRef}>
					<div className={styles.content} style={{ width: designWidth }} ref={containerRef} >
						<TimelineNumbers start={event.startDateTime} end={event.endDateTime} />
						<div className={styles.localUserResponses}>
							{localUserResponses.map((eventResponse: EventResponse, index: number) => {
								return <ResizableTimeCard key={index} event={eventResponse} timeline={timeline} updateHandler={handleUpdate} />
							})}
							{isAdding && <TranslucentTimeCard container={containerRef} scrollingContainer={scrollingContainerRef} timeline={timeline} createHandler={handleCreate} />}
						</div>
						<div>
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