import EventFilters from "@/components/dashboard/events/eventFilters";
import { getEvents } from "@/lib/supabase/queries/getEvents";
import { createClient } from "@/lib/supabase/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Events() {
	const queryClient = new QueryClient();
	const supabase = createClient();
	await queryClient.prefetchQuery({
		queryKey: ["getAllEvents"],
		queryFn: async () => {
			return getEvents(supabase);
		},
	});

	return (
		<div className="flex grow flex-col gap-4 p-4 prose min-w-full col-start-2 col-end-3 ">
			<div>
				<h3 className="m-0">
					Events
				</h3>
				<p className="m-0">
					See your upcoming and past events
				</p>
			</div>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<EventFilters />
			</HydrationBoundary>
		</div>
	);
}
