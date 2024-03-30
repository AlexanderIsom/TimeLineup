'use server'

import { getFriends } from "@/app/addfriend/actions"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import CreateEventDialog from "./createEventDialog"

export default async function EventServerDialog() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["friends"],
		queryFn: getFriends,
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateEventDialog />
		</HydrationBoundary>
	)

}