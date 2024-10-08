"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { getEvents } from "@/lib/supabase/queries/getEvents";
import { useQuery } from "@tanstack/react-query";
import { format, isFuture, isPast } from "date-fns";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import RsvpToggle from "./rsvpToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function EventFilters() {
	const supabase = useSupabaseBrowser();
	const [filter, setFilter] = useQueryState("filter");

	const { data: events, isLoading, error, isPending } = useQuery({
		queryKey: ["getAllEvents"],
		queryFn: async () => {
			return getEvents(supabase);
		},
	});

	if (error) {
		console.log(error.message);
	}

	let content;

	if (isLoading || isPending) {
		content = <div>loading...</div>
	} else if (!events || events.length <= 0) {
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
						return isFuture(mergedStartTime);
					}
					if (filter === "hosting") {
						return event.is_host;
					}
					if (filter === "pending") {
						return event.local_rsvp?.status === "pending";
					}
					if (filter === "past") {
						return isPast(mergedStartTime);
					}
					if (filter === "declined") {
						return event.local_rsvp?.status === "declined";
					}
					return true;
				}).map((event) => {
					const mergedEndTime = new Date(event.date);
					mergedEndTime.setHours(new Date(event.end_time).getHours());
					mergedEndTime.setMinutes(new Date(event.end_time).getMinutes());
					return <div key={event.id} className="not-prose flex flex-col md:flex-row gap-2 items-center justify-between border p-2 rounded-md">
						<div className="w-full flex gap-2">
							<div className="flex flex-col items-center justify-center text-center w-20">
								<Avatar className="not-prose size-14">
									<AvatarImage src={event.host_profile?.avatar_url ?? undefined} />
									<AvatarFallback className="bg-gray-200">
										<User />
									</AvatarFallback>
								</Avatar>
								<p className="text-sm truncate w-20">{event.host_profile?.username}</p>

							</div>
							<div className="flex gap-2 h-full w-full  mx-2">
								<div className="flex flex-col text-center w-2/3">
									<p className="text-xs text-gray-400 w-11/12">details</p>

									<p className="font-bold truncate w-11/12">{event.title}</p>
									<p className="text-sm truncate w-11/12">{event.description}</p>

								</div>

								<div className="flex flex-col text-center w-1/3">
									<p className="text-xs text-gray-400">when</p>
									<div className="flex flex-col items-center ">
										<p>{format(event.date, "PPP")}</p>
										<p className="text-xs">{format(event.start_time, "HH:mm")} - {format(event.end_time, "HH:mm")}</p>
									</div>
								</div>
							</div>
						</div>
						{isFuture(mergedEndTime) ?
							<div className="flex gap-2 min-w-64 justify-end w-full md:w-auto">
								{event.is_host ? "Hosting" : <RsvpToggle rsvpId={event.local_rsvp!.id} defaultStatus={event.local_rsvp!.status} />}

								<Button variant={"secondary"} asChild>
									<Link href={`/dashboard/events/${event.id}`} className="no-underline underline-offset-2">
										view
									</Link>
								</Button>

							</div> : <div className="min-w-64 w-full flex justify-center"><Badge className="bg-red-500">Ended</Badge></div>}
					</div>
				})}
			</div>
		)
	}


	return (
		<>
			<div className="hidden md:flex gap-1">
				<Button variant={filter === "upcoming" ? "secondary" : "ghost"} onClick={() => {
					setFilter("upcoming");
				}}>
					Upcoming
				</Button>
				<Button variant={filter === "hosting" ? "secondary" : "ghost"} onClick={() => {
					setFilter("hosting");
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

			<Select defaultValue={filter ?? "upcoming"} onValueChange={setFilter} value={filter ?? "upcoming"}>
				<SelectTrigger className="w-full flex md:hidden">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="upcoming">Upcoming</SelectItem>
					<SelectItem value="hosting">Hosting</SelectItem>
					<SelectItem value="pending">Unconfirmed</SelectItem>
					<SelectItem value="past">Past</SelectItem>
					<SelectItem value="declined">Declined</SelectItem>
				</SelectContent>
			</Select>

			{content}

		</>
	)
}