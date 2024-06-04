import { and, eq, ilike, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { friendships, profiles } from "@/db/schema";

export async function GET(request: Request) {
	const supabase = createClient();

	const { data:{user}, error } = await supabase.auth.getUser();
	if (error || !user) {
		return;
	}

	const queryResult = await db
		.select({
			id: friendships.id,
			status: friendships.status,
			incoming: sql<boolean>`friendship.receiving_user = ${user.id}`,
			profile: { ...profiles },
		})
		.from(friendships)
		.innerJoin(
			profiles,
			or(
				and(ne(friendships.sending_user, user.id), eq(friendships.sending_user, profiles.id)),
				and(ne(friendships.receiving_user, user.id), eq(friendships.receiving_user, profiles.id)),
			),
		)
		.where(or(eq(friendships.sending_user, user.id), eq(friendships.receiving_user, user.id)));

	return Response.json(queryResult);
}