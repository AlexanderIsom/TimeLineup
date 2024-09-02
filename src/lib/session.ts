import { cache } from "react";
import { createClient } from "./supabase/server";

const fetchUser = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
};

const fetchProfile = async (id: string) => {
	const supabase = createClient();
	const { data: profile } = await supabase.from("profile").select(`*`).match({ id: id }).single();

	return profile;
};

export async function getUser(useCache = true) {
	if (useCache) {
		return cache(fetchUser)();
	} else {
		return fetchUser();
	}
}

export async function getCurrentProfile(useCache = true) {
	const user = await getUser(useCache);
	if (!user) return {};

	if (useCache) {
		return { profile: await cache(fetchProfile)(user.id), user: user };
	} else {
		return { profile: await fetchProfile(user.id), user: user };
	}
}

export async function getProfile(id: string, useCache = true) {
	if (useCache) {
		return cache(fetchProfile)(id);
	} else {
		return fetchProfile(id);
	}
}
