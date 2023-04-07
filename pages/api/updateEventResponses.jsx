import { prisma } from "../../lib/db";


async function updateTimes(resposneId, startDateTime, endDateTime) {
	return await prisma.$transaction(async (tx) => {
		await tx.eventResponse.update({
			data: {
				startDateTime: startDateTime,
				endDateTime: endDateTime,
			},
			where: {
				id: resposneId
			}
		})
	})
}

const updateEventResponses = async (req, res) => {
	try {

		const { sessionUserResponses } = req.body;
		sessionUserResponses.forEach(response => {
			updateTimes(response.id, response.startDateTime, response.endDateTime)
		});


	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default updateEventResponses;
