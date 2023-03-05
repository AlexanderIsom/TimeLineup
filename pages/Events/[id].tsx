import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { Event } from "../../types"

interface EventProps {
	currentEvent: Event
}

export default function ViewEvent({ currentEvent }: EventProps) {
	console.log("recieved " + currentEvent)

	return <h1>event name: {currentEvent.name}</h1>
}


export async function getServerSideProps({ params }: any) {
	try {
		const client = await clientPromise;
		const db = client.db("Events");
		const id = new ObjectId(params.id)
		const event = await db.collection("events").findOne({ _id: id });

		return {
			props: { currentEvent: JSON.parse(JSON.stringify(event)) as Event },
		};
	} catch (e) {
		console.error(e);
	}
}
