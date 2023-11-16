import { db } from "@/db";
import event from "@/db/schema/event";

export async function POST(request: Request) {
    await db.insert(event).values({
        startTime: new Date(),
        endTime: new Date(),
    });
}