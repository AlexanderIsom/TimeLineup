import { createBrowserClient } from "@supabase/ssr";
import type { TypedSupabaseClient } from "@/utils/types";
import { useMemo } from "react";
import { Database } from "./database.types";

let client: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
	if (client) {
		return client;
	}

	client = createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

	return client;
}

function useSupabaseBrowser() {
	return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
