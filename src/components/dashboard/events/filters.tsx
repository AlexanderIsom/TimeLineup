"use client"
import { Button } from "@/components/ui/button";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

export default function EventFilters() {
	const [filter, setFilter] = useQueryState("filter");
	const router = useRouter();
	const supabase = useSupabaseBrowser();



	// let content;
	// if (!events || events.length <= 0) {
	// 	content = <div className="size-full flex flex-col gap-2 justify-center items-center text-center">
	// 		<div className="bg-gray-200 rounded-full p-4">
	// 			<Calendar className="size-8" />
	// 		</div>
	// 		<div className="flex flex-col gap-1 text-center items-center justify-center">
	// 			<h3 className="m-0">No upcoming events</h3>
	// 			<p className="m-0 text-wrap w-3/4">you have no upcoming events, As soon as you make an event or accept an invite to one it will show up here</p>
	// 		</div>
	// 	</div>
	// } else {
	// 	content = (
	// 		<div className="flex flex-col gap-4">
	// 			{events.map((event) => {
	// 				return <div key={event.id} className="not-prose flex gap-2 items-center justify-between border p-2 rounded-md">
	// 					<div className="flex flex-col items-center justify-center text-center w-20">

	// 						<ProfileAvatar className="not-prose size-14" profile={event.host_profile!} iconOnly={true} />
	// 						<p className="text-sm truncate w-20">{event.host_profile?.username}</p>

	// 					</div>
	// 					<div className="flex gap-2 h-full w-full mx-2">
	// 						<div className="flex flex-col text-center w-2/3">
	// 							<p className="text-xs text-gray-400 w-11/12">details</p>

	// 							<p className="font-bold truncate w-11/12">{event.title}</p>
	// 							<p className="text-sm truncate w-11/12">{event.description}</p>

	// 						</div>
	// 						<Separator orientation="vertical" />
	// 						<div className="flex flex-col text-center w-1/3">
	// 							<p className="text-xs text-gray-400">when</p>
	// 							<div className="flex flex-col items-center">
	// 								<p>{format(event.date, "PPP")}</p>
	// 								<p>{format(event.start_time, "HH:mm")} - {format(event.end_time, "HH:mm")}</p>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="flex gap-2 min-w-64  justify-end">
	// 						<div className="flex gap-2">
	// 							<div className="flex items-center gap-2">
	// 								{event.is_host ? "Hosting" : <RsvpToggle rsvpId={event.local_rsvp!.id} defaultStatus={event.local_rsvp!.status} />}
	// 							</div>
	// 						</div>
	// 						<div>
	// 							<Button variant={"ghost"}>
	// 								view
	// 							</Button>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			})}
	// 		</div>
	// 	)
	// }

	return (
		<>

			<div className="flex gap-1">
				<Button variant={filter === null ? "secondary" : "ghost"} onClick={() => {
					setFilter(null);
					router.replace('/')
				}}>
					Upcoming
				</Button>
				<Button variant={filter === "hosting" ? "secondary" : "ghost"} onClick={() => {
					setFilter("hosting");
					router.replace('/')
				}}>
					Hosting
				</Button>
				<Button variant={filter === "pending" ? "secondary" : "ghost"} onClick={() => {
					setFilter("pending");
				}}>
					Unconfirmed
				</Button>
				<Button variant={filter === "past" ? "secondary" : "ghost"} onClick={() => {
					setFilter("past");
				}}>
					Past
				</Button>
				<Button variant={filter === "declined" ? "secondary" : "ghost"} onClick={() => {
					setFilter("declined");
				}}>
					Declined
				</Button>
			</div>


		</>
	)
}