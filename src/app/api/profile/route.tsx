import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function GET(request: Request) {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		return;
	}

	const user = await db.query.profiles.findFirst({
		where: eq(profiles.id, data.user.id),
	});

	if (user === undefined) {
		return;
	}

	return Response.json(user);
}
