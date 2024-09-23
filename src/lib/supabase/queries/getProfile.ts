import { TypedSupabaseClient } from "@/utils/types";

const fetchUser = async (client: TypedSupabaseClient) => {
	const {
		data: { user },
	} = await client.auth.getUser();

	return user;
};

const fetchProfile = async (client: TypedSupabaseClient, id: string) => {
	const { data: profile } = await client.from("profile").select(`*`).match({ id: id }).single();

	return profile;
};

export async function getCurrentProfile(client: TypedSupabaseClient) {
	const user = await fetchUser(client);
	if (!user) return;
	return fetchProfile(client, user?.id);
}
