import { addMinutes, differenceInMinutes, eachMinuteOfInterval, roundToNearestMinutes, sub, subMinutes } from "date-fns";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import { GetServerSidePropsContext } from "next";
import { EventData } from "types";
import { ResponseState } from "types/Events";

export default function verifyData() {
	return <></>
}


export async function getServerSideProps(context: GetServerSidePropsContext) {

	try {
		const { params } = context;

		const client = await clientPromise
		const db = client.db("TimeLineupDemo")

		const userResponses = await db.collection("EventResponse").aggregate([
			{ $match: {} },
			{
				$lookup: {
					from: 'Event', // The collection to perform the join with
					localField: 'eventId', // The field from the posts collection
					foreignField: '_id', // The field from the users collection
					as: 'event' // The field where the joined document will be stored
				},
			}, { $unwind: "$event" }]).toArray();

		// const events = await db.collection("Event").find({}).toArray();

		// events.forEach(async (obj) => {
		// 	const invites: ObjectId[] = []
		// 	const userResponsesForEvent = userResponses.filter(r => r.eventId.toString() === obj._id.toString());
		// 	userResponsesForEvent.forEach((userResponse) => {
		// 		invites.push(userResponse.userId)
		// 	})
		// 	obj.invites = invites;
		// 	db.collection("Event").replaceOne({ _id: obj._id }, obj)
		// })

		// userResponses.forEach((obj) => {
		// 	delete obj.event;
		// 	db.collection("EventResponse").replaceOne({ _id: obj._id }, obj)
		// })

		return {
			props: {},
		};
	} catch (e) {
		console.error(e);
		return {
			props: { event: [] }
		}
	}
}
