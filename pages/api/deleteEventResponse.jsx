import { prisma } from "../../lib/db";

const deleteEventResponse = async (req, res) => {
	try {
		const { event } = req.body;
		await prisma.eventResponse.delete({
			where: {
				id: event.id
			}
		});
		return res.send({ status: 200 })
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default deleteEventResponse;
