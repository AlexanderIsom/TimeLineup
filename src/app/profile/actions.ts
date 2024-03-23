import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

export async function getUserProfile() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return
	}

	const user = await db.query.profiles.findFirst({
		where: eq(profiles.id, data.user.id)
	})

	if (user === undefined) {
		return
	}

	return user;
}