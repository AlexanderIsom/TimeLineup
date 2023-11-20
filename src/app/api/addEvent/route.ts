import { db } from "@/db";
import event from "@/db/schema/event";

export async function POST(request: Request) {
    const res = await request.json()
    console.log("BODY",res)
    // const req = await request.json()
    // await db.insert(event).values({
    //     userId: request.user,
    // });
}