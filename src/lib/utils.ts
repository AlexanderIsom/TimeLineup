import { Tables } from "@/utils/database.types";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getUser = async (supabase: SupabaseClient) => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
};

export const getProfile = async (supabase: SupabaseClient, slug: string | undefined = undefined) => {
	let user;
	let match;
	if (slug !== undefined) {
		match = { slug };
	} else {
		user = await getUser(supabase);
		if (!user) return { profile: undefined, user: undefined };
		match = { id: user.id };
	}

	const { data: profile } = await supabase.from("profile").select(`*`).match(match).single();

	return { profile, user } as { profile: Tables<"profile">; user: User };
};

export const getSession = (supabase: SupabaseClient) => {
	return supabase.auth.getSession();
};
