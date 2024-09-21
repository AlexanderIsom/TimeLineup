import { TypedSupabaseClient } from "@/utils/types";

export function getRsvps(client: TypedSupabaseClient, id: number) {
	return client.from("rsvp").select("*, user_profile:profile(*)").eq("event_id", id);
}