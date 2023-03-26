import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUser = async (req, res) => {
	try {
		const { userId } = req.body
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		res.json(user)
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};

export default getUser;
