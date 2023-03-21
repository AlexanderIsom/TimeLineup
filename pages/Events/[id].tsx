import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { Event, EventResponses } from "../../types/Events"

interface EventProps {
	currentEvent: Event
	eventResponses: EventResponses;
}

export default function ViewEvent({ currentEvent, eventResponses }: EventProps) {
	console.log(eventResponses);

	return <h1>event name: {currentEvent.name}</h1>
}

export async function getServerSideProps({ params }: any) {
	try {
		const client = await clientPromise;
		const db = client.db("Events");
		const id = new ObjectId(params.id)
		const event = await db.collection("events").findOne({ _id: id });
		const responses = await db.collection("responses").find({ eventId: params.id }).toArray();

		return {
			props: { currentEvent: JSON.parse(JSON.stringify(event)) as Event, eventResponses: JSON.parse(JSON.stringify(responses)) as EventResponses },
		};
	} catch (e) {
		console.error(e);
	}
}
