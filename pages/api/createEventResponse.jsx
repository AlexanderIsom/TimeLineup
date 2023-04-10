import { prisma } from "../../lib/db";

const createEventResponse = async (req, res) => {
	try {
		const { eventId, userId, startDateTime, endDateTime } = req.body;
		const newEvent =
		{
			eventId: eventId,
			userId: userId,
			startDateTime: startDateTime,
			endDateTime: endDateTime,
		}

		await prisma.eventResponse.create({ data: newEvent });
		return res.send({ status: 200 })
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default createEventResponse;
