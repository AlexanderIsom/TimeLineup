import { prisma } from "lib/db";
import { Event, EventResponse } from "types/Events"
import TimelineContainer from "components/TimelineContainer";
import { useSession } from "next-auth/react";
import styles from "styles/id.module.scss"
import { format, parseISO } from "date-fns";
import CreateTimeline from "utils/TimelineUtils"
import TimelineNumbers from "components/TimelineNumber";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useState } from "react";

interface EventProps {
	event: Event
	eventResponses: EventResponse[];
}

export default function ViewEvent({ event, eventResponses }: EventProps) {
	const { data: session } = useSession();
	const timeline = CreateTimeline({ start: event.startDateTime, end: event.endDateTime, size: 1920 })
	const sessionUserResponses = eventResponses.filter(event => event.userId == session?.user.id)

	async function handleSave() {
		try {
			let response = await fetch("http://localhost:3000/api/updateEventResponses", {
				method: "POST",
				body: JSON.stringify({
					sessionUserResponses
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

	function handleUpdate(id: string, start: Date, end: Date) {
		const response = sessionUserResponses.find(r => r.id === id)
		if (response) {
			response.startDateTime = start;
			response.endDateTime = end;
		}
	}

	return (<>
		<div className={styles.wrapper}>
			<div className={styles.userInfo}>users</div>
			<div className={styles.timelineContainer}>
				<div className={styles.timelineTools}>
					<div className={styles.magnify}>
						<div className={styles.buttonLeft}><FiZoomIn className={styles.icon} /></div>
						<div className={styles.buttonRight}><FiZoomOut className={styles.icon} /></div>
					</div>
					<button className={styles.saveButton} onClick={handleSave}>save</button>
				</div>
				<div className={styles.scrollable} >
					<div className={styles.content}>
						<TimelineNumbers start={event.startDateTime} end={event.endDateTime} />
						<div className={styles.timelineBody}>
							<div className={styles.column} />
							<div className={styles.responses}>
								{sessionUserResponses.map((eventResponse: EventResponse, index: number) => {
									return <TimelineContainer key={index} event={eventResponse} timeline={timeline} updateHandler={handleUpdate} />
								})}
							</div>
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

export async function getServerSideProps({ params }: any) {
	try {
		const event = await prisma.event.findUnique({
			where: {
				id: params.id
			},
			include: {
				user: true,
			}
		});

		const eventReseponses = await prisma.eventResponse.findMany({
			where: {
				eventId: params.id
			},
			include: {
				user: true,
			}
		})

		console.log(event)

		return {
			props: { event: JSON.parse(JSON.stringify(event)) as Event, eventResponses: JSON.parse(JSON.stringify(eventReseponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
	}
}
