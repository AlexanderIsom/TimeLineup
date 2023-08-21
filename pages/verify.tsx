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

		// const userResponses = await db.collection("EventResponse").find().forEach((obj) => {
		// 	obj.schedule.forEach((item: any) => {
		// 		if (item.start > item.end) {

		// 		}
		// 	});
		// })

		// userResponses.forEach((obj) => {
		// 	obj.schedule.forEach((item: any) => {
		// 		if (item.start > obj.event.endDateTime || item.start < obj.event.startDateTime || item.end > obj.event.endDateTime || item.end < obj.event.startDateTime) {
		// 			console.log(obj.event.startDateTime, item.start)
		// 		}
		// 	});
		// })

		// userResponses.forEach((obj) => {
		// 	if (obj.schedule.declined) {
		// 		obj.state = ResponseState.declined
		// 	} else if (obj.schedule.length > 0) {
		// 		obj.state = ResponseState.attending
		// 	} else {
		// 		obj.state = ResponseState.pending
		// 	}
		// 	db.collection("EventResponse").updateOne({ _id: obj._id }, { $set: { state: obj.state } })
		// })

		// userResponses.forEach((obj) => {
		// 	var updated = false;
		// 	obj.schedule.forEach((item: any) => {
		// 		updated = true
		// 		const earliestStart = new Date(obj.event.startDateTime)
		// 		const latestStart = addMinutes(new Date(obj.event.startDateTime), 60)

		// 		const earliestEnd = subMinutes(new Date(obj.event.endDateTime), 60)
		// 		const latestEnd = new Date(obj.event.endDateTime)

		// 		var newStart = new Date(earliestStart.getTime() + Math.random() * (latestStart.getTime() - earliestStart.getTime()))
		// 		newStart = roundToNearestMinutes(newStart, { nearestTo: 15 })

		// 		var newEnd = new Date(earliestEnd.getTime() + Math.random() * (latestEnd.getTime() - earliestEnd.getTime()))
		// 		newEnd = roundToNearestMinutes(newEnd, { nearestTo: 15 })
		// 		// console.log(obj._id, newStart, newEnd)
		// 		item.start = newStart
		// 		item.end = newEnd
		// 		const duration = differenceInMinutes(newEnd, newStart);
		// 		// console.log(duration)
		// 		item.duration = duration;

		// 		// TODO change event start and end date into start and duration 
		// 		// TODO change event schedules into start and duration instead of start and end
		// 		// TODO potentially store time only ?
		// 	});


		// 	if (updated) {
		// 		db.collection("EventResponse").updateOne({ _id: obj._id }, { $set: { schedule: obj.schedule } })
		// 		console.log("updated")
		// 	}
		// })

		// db.collection("EventResponse").replaceMany({}, userResponses);

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
