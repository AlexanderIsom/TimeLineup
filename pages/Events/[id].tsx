import { PrismaClient } from "@prisma/client";
import { Event, EventResponse } from "../../types/Events"
import styles from "../../styles/Components/EventResponse.module.scss"

import CreateTimeline from "../../utils/time"
import { useEffect, useState } from "react";

import TimelineContainer from "../../components/timelineComponent";

const prisma = new PrismaClient();
interface EventProps {
	currentEvent: Event
	eventResponses: EventResponse[];
}

export default function ViewEvent({ currentEvent, eventResponses }: EventProps) {
	const [viewportWidth, setViewportWidth] = useState(0);
	const timeline = CreateTimeline({ start: currentEvent.startDateTime, end: currentEvent.endDateTime, viewportWidth: viewportWidth })

	useEffect(() => {
		const handleWindowResize = () => {
			setViewportWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleWindowResize);
		handleWindowResize();
		return () => window.removeEventListener("resize", handleWindowResize);
	}, [])

	return (<>
		<div className={styles.responsesContainer}>

			{eventResponses.map((eventResponse: EventResponse, index: number) => {
				return <TimelineContainer key={index} event={eventResponse} timeline={timeline} index={index} />
			})}
		</div>
	</>)
}

export async function getServerSideProps({ params }: any) {
	try {
		const event = await prisma.event.findUnique({
			where: {
				id: params.id
			}
		});

		const eventReseponses = await prisma.eventResponse.findMany({
			where: {
				eventId: params.id
			}
		})

		return {
			props: { currentEvent: JSON.parse(JSON.stringify(event)) as Event, eventResponses: JSON.parse(JSON.stringify(eventReseponses)) as EventResponse[] },
		};
	} catch (e) {
		console.error(e);
	}
}
