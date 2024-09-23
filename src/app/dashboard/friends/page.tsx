import FriendFilters from "@/components/dashboard/friends/friendFilters";
import { getCurrentProfile } from "@/lib/session";
import { getFriends } from "@/lib/supabase/queries/getFriends";
import { createClient } from "@/lib/supabase/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"

export default async function Friends() {
	const queryClient = new QueryClient();
	const supabase = createClient();
	const profile = await getCurrentProfile()
	await prefetchQuery(queryClient, getFriends(supabase))

	return <div className="p-4 prose space-y-4 min-w-full flex flex-col col-start-2 col-end-3 ">
		<div>
			<h3 className="m-0">
				Friends
			</h3>
			<p className="m-0">
				see and manage your friends.
			</p>
		</div>
		<HydrationBoundary state={dehydrate(queryClient)}>
			<FriendFilters profile={profile.profile!} />
		</HydrationBoundary>
	</div>
}