import clientPromise from "../../lib/mongodb";

const addEvent = async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("Events");
    const { name, startDateTime, endDateTime } = req.body;

    const post = await db.collection("events").insertOne({
      name,
      startDateTime,
      endDateTime,
    });

    res.json(post);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default addEvent;
