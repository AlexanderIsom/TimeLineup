import { Profile } from "@/db/schema";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";

export async function getProfile(supabase: SupabaseClient, slug: string | undefined = undefined) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let match;
	if (slug !== undefined) {
		match = { slug };
	} else {
		match = { id: user?.id };
	}

	const { data: profile } = await supabase.from("profile").select(`*`).match(match).single();

	return {
		profile,
		user,
	} as { profile: Profile; user: User | null };
}

export async function getSession(supabase: SupabaseClient) {
	const { data } = await supabase.auth.getSession();
	return data.session;
}
