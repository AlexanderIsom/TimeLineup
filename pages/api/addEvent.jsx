import { prisma } from "../../lib/db";

const addEvent = async (req, res) => {
  try {
    const { ownerId, title, startDateTime, endDateTime } = req.body;
    const newEvent =
    {
      userId: ownerId,
      title: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    }

    await prisma.event.create({ data: newEvent });
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default addEvent;
