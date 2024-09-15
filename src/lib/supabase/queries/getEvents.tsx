import { TypedSupabaseClient } from "@/utils/types";


export async function getEvents(client: TypedSupabaseClient) {
	const { data: { user } } = await client.auth.getUser();
	if (!user) {
		return [];
	}

	const { data } = await client
		.from("event")
		.select("*, host_profile:profile(*), rsvps:rsvp(*)")
		.order("start_time")
		.throwOnError();

	if (!data) {
		return []
	};

	const modifiedData = data.map((event) => ({
		...event,
		is_host: event.host === user.id,
		local_rsvp: event.rsvps.find((rsvp) => rsvp.user_id === user.id),
	}));

	return modifiedData;
}