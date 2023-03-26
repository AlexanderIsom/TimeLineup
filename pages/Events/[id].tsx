import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import EventResponseForm from "../../components/NewEventResponseForm";
import { Event, EventResponse } from "../../types/Events"
import create from "../../utils/time";
import styles from "../../styles/Components/eventResponse.module.scss"

const prisma = new PrismaClient();
interface EventProps {
	currentEvent: Event
	eventResponses: EventResponse[];
}

export default function ViewEvent({ currentEvent, eventResponses }: EventProps) {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
	const [showModal, setShowModal] = useState(false);
	const startDate = new Date(currentEvent.startDateTime);
	const endDate = new Date(currentEvent.endDateTime);
	const timeBar = create({ start: startDate, end: endDate, viewportWidth: windowSize.width })

	useEffect(() => {
		function handleWindowResize() {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight })
		}

		window.addEventListener("resize", handleWindowResize);
		handleWindowResize();
		return () => window.removeEventListener("resize", handleWindowResize);
	}, [])

	return (<>
		<Modal show={showModal} handleClose={() => setShowModal(false)}>
			<EventResponseForm />
		</Modal>
		<button
			type="button"
			onClick={() => setShowModal(true)}
		>
			New Response
		</button>
		<h1>event name: {currentEvent.title}</h1>
		<div className={styles.responsesContainer}>
			{eventResponses.map((eventResponse: EventResponse, index: number) => {
				const responseStartDate = new Date(eventResponse.startDateTime);
				const responseEndDate = new Date(eventResponse.endDateTime);
				return <div key={index} className={styles.eventResponse} style={timeBar.toStyleLeftAndWidth(responseStartDate, responseEndDate, index)}>hello</div>
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
