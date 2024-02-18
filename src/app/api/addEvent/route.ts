import { db } from "@/db";
import event from "@/db/schema/event";

export async function POST(request: Request) {
    const res = await request.json()
    console.log("BODY", res)

    await db.insert(event).values({
        userId: res.userId,
        title: res.title,
        start: new Date(res.start),
        end: new Date(res.end),
        description: res.description,
        invitedUsers: []
    });

    return new Response("success", {
        status: 200,
    });
}