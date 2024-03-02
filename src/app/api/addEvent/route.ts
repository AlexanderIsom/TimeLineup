import { db } from "@/db";
import { events } from "@/db/schema/event";

export async function POST(request: Request) {
    const res = await request.json()
    console.log("BODY", res)

    await db.insert(events).values({
        user_id: res.userId,
        title: res.title,
        start: new Date(res.start),
        end: new Date(res.end),
        description: res.description,
        invited_users: []
    });

    return new Response("success", {
        status: 200,
    });
}