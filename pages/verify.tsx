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

		// userResponses.forEach((obj) => {
		// 	var updated = false;
		// 	// const startTime = new Date(obj.event.startDateTime);
		// 	delete obj.declined;
		// 	updated = true
		// 	// obj.schedule.forEach((item: any) => {
		// 	// 	// item.offsetFromStart = differenceInMinutes(new Date(item.start), startTime)
		// 	// 	delete item.declined;
		// 	// });

		// 	if (updated) {
		// 		db.collection("EventResponse").replaceOne({ _id: obj._id }, obj)
		// 		console.log("updated")
		// 	}
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
