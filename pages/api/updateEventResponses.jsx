import { prisma } from "../../lib/db";


const updateEventResponses = async (req, res) => {
	try {
		const { schedule, eventId, userId } = req.body;

		await prisma.eventResponse.update({
			where: {
				userId: userId,
				eventId: eventId
			},
			data: {
				schedule: schedule
			}
		})

	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default updateEventResponses;
