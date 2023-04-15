import { prisma } from "../../lib/db";

const updateEventResponses = async (req, res) => {
	try {
		const { schedule, eventId, userId, responseId } = req.body;

		await prisma.eventResponse.update({
			where: {
				id: responseId
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
