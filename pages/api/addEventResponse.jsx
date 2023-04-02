import { prisma } from "../../lib/db";

const addEventResponse = async (req, res) => {
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
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default addEventResponse;
