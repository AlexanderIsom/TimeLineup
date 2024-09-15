import { GetEvents } from "@/actions/eventActions";
import RsvpToggle from "@/components/dashboard/events/rsvpToggle";
import { ProfileAvatar } from "@/components/profileAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, isAfter } from "date-fns";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default async function Events({
	searchParams
}: {
	searchParams: Record<string, string | string[] | undefined>
}) {

	const events = await GetEvents();
	const filter = searchParams.filter ?? "upcoming";

	let content;
	if (!events || events.length <= 0) {
		content = <div className="size-full flex flex-col gap-2 justify-center items-center text-center">
			<div className="bg-gray-200 rounded-full p-4">
				<Calendar className="size-8" />
			</div>
			<div className="flex flex-col gap-1 text-center items-center justify-center">
				<h3 className="m-0">No upcoming events</h3>
				<p className="m-0 text-wrap w-3/4">you have no upcoming events, As soon as you make an event or accept an invite to one it will show up here</p>
			</div>
		</div>
	} else {
		content = (
			<div className="flex flex-col gap-4">
				{events.filter((event) => {
					const mergedStartTime = new Date(event.date);
					mergedStartTime.setHours(new Date(event.end_time).getHours());
					mergedStartTime.setMinutes(new Date(event.end_time).getMinutes());
					if (filter === "upcoming") {
						return isAfter(mergedStartTime, new Date());
					}
					if (filter === "hosting") {
						return event.is_host;
					}
					if (filter === "pending") {
						return event.local_rsvp?.status === "pending";
					}
					if (filter === "past") {
						return isAfter(new Date(), mergedStartTime);
					}
					if (filter === "declined") {
						return event.local_rsvp?.status === "declined";
					}
					return true;
				}).map((event) => {
					return <div key={event.id} className="not-prose flex gap-2 items-center justify-between border p-2 rounded-md">
						<div className="flex flex-col items-center justify-center text-center w-20">

							<ProfileAvatar className="not-prose size-14" profile={event.host_profile!} iconOnly={true} />
							<p className="text-sm truncate w-20">{event.host_profile?.username}</p>

						</div>
						<div className="flex gap-2 h-full w-full mx-2">
							<div className="flex flex-col text-center w-2/3">
								<p className="text-xs text-gray-400 w-11/12">details</p>

								<p className="font-bold truncate w-11/12">{event.title}</p>
								<p className="text-sm truncate w-11/12">{event.description}</p>

							</div>
							<Separator orientation="vertical" />
							<div className="flex flex-col text-center w-1/3">
								<p className="text-xs text-gray-400">when</p>
								<div className="flex flex-col items-center ">
									<p>{format(event.date, "PPP")}</p>
									<p className="text-xs">{format(event.start_time, "HH:mm")} - {format(event.end_time, "HH:mm")}</p>
								</div>
							</div>
						</div>
						<div className="flex gap-2 min-w-64  justify-end">
							<div className="flex gap-2">
								<div className="flex items-center gap-2">
									{event.is_host ? "Hosting" : <RsvpToggle rsvpId={event.local_rsvp!.id} defaultStatus={event.local_rsvp!.status} />}
								</div>
							</div>
							<div>
								<Button variant={"ghost"} asChild>
									<Link href={`/dashboard/events/${event.id}`} className="no-underline underline-offset-2">
										view
									</Link>
								</Button>
							</div>
						</div>
					</div>
				})}
			</div>
		)
	}

	return (
		<div className="flex grow flex-col gap-4 p-4 prose min-w-full">
			<div>
				<h3 className="m-0">
					Events {filter}
				</h3>
				<p className="m-0">
					See your upcoming and past events
				</p>
			</div>
			<div className="flex gap-1">
				<Button variant={filter === "upcoming" ? "secondary" : "ghost"} asChild>
					<Link href={"?filter=upcoming"} className="no-underline underline-offset-2">
						Upcoming
					</Link>
				</Button>
				<Button variant={filter === "hosting" ? "secondary" : "ghost"} asChild>
					<Link href={"?filter=hosting"} className="no-underline underline-offset-2">
						Hosting
					</Link>
				</Button>
				<Button variant={filter === "pending" ? "secondary" : "ghost"} asChild>
					<Link href={"?filter=pending"} className="no-underline underline-offset-2">
						Unconfirmed
					</Link>
				</Button>
				<Button variant={filter === "past" ? "secondary" : "ghost"} asChild>
					<Link href={"?filter=past"} className="no-underline underline-offset-2">
						Past
					</Link>
				</Button>
				<Button variant={filter === "declined" ? "secondary" : "ghost"} asChild>
					<Link href={"?filter=declined"} className="no-underline underline-offset-2">
						Declined
					</Link>
				</Button>
			</div>

			<Card className="w-full h-full p-4">
				{content}
			</Card>
		</div>
	);
}
