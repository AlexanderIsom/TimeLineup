import { Tables } from "@/utils/database.types";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "./supabase/server";

const fetchUser = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
};

const fetchProfile = async () => {
	const supabase = createClient();

	const user = await fetchUser();
	if (!user) return { profile: undefined, user: undefined };

	const { data: profile } = await supabase.from("profile").select(`*`).match({ id: user.id }).single();

	return { profile, user } as { profile: Tables<"profile"> | undefined; user: User | undefined };
};

export async function getUser(useCache = true) {
	if (useCache) {
		return cache(fetchUser)();
	} else {
		return fetchUser();
	}
}

export async function getCurrentProfile(useCache = true) {
	if (useCache) {
		return cache(fetchProfile)();
	} else {
		return fetchProfile();
	}
}
