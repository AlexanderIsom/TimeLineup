import { prisma } from "../../lib/db";
import { NextApiHandler } from 'next'

const getUser: NextApiHandler = async (req, res) => {
  const { userId } = req.query

  if (typeof userId !== "string") {
    return res.status(400)
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    res.json(user)
  } catch (e: any) {
    console.error(e)
    throw new Error(e).message
  }
}

export default getUser
