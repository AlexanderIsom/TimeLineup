import styles from "@/styles/Components/Events/EventDetails.module.scss";
import { formatDateRange } from "@/utils/dateUtils"
import { AgendaItem, EventData } from "@/lib/types/Events"
import React, { useMemo } from "react";
import { addMinutes, format } from "date-fns";
import Image from "next/image"
import { Profile, Rsvp } from "@/db/schema";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventWithRsvpAndUser } from "@/db/schemaTypes";
import { CalendarRange } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EventDataQuery } from "@/actions/eventActions";
import { NotUndefined } from "@/utils/TypeUtils";

interface Props {
	event: NotUndefined<EventDataQuery>
}

export default async function EventDetails({ event }: Props) {
	const declinedUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "declined";
	}), [event]);

	const attendingUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "accepted";
	}), [event]);

	const invitedUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "pending";
	}), [event]);

	// var attendingCount = attendingUsers.length;
	// var invitedCount = invitedUsers.length;
	// var declinedCount = declinedUsers.length;
	// var showButtons = event.userId !== ResponseState.hosting;

	return (
		<Card className="w-full max-w-md mx-auto shadow-lg">
			<CardHeader className="rounded-t-lg">
				<CardTitle>Event Details</CardTitle>
				<CardDescription>The details of the event including the name, date, and location.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-6">
				<div className="flex items-start gap-4">
					<div className="flex rounded-md bg-gray-100 w-16 h-16 text-center justify-center items-center">
						<span className="text-2xl font-bold">
							{event.title!.substring(0, 2)}
						</span>
					</div>
					<div className="grid gap-1">
						<h3 className="text-lg font-bold">{event.title}</h3>
						{/* <p className="text-sm font-medium leading-none">Jun 21 - 25, 2023</p> */}
						<p className="text-sm font-medium leading-none">{formatDateRange(event.start, event.end)}</p>
					</div>
				</div>
			</CardContent>
			<CardContent className="flex flex-col gap-4 p-6">
				<div className="grid gap-4">
					<h3 className="text-sm font-medium leading-none">Organizer</h3>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={event.host.avatarUrl!} />
							<AvatarFallback>{event.host.username!.substring(0, 2)}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium leading-none">{event.host.username}</span>
					</div>
				</div>
			</CardContent>
			<CardContent className={`flex flex-col gap-4 p-6`}>
				<div className="grid gap-1">
					<h3 className="text-sm font-medium leading-none">Description</h3>
					<div className="prose prose-sm max-w-none">
						<p className={`${event.description === "" && "text-sm"}`}>
							{event.description === "" ? "no description provided" : event.description}
						</p>
					</div>
				</div>
			</CardContent>

			<CardContent className="flex flex-col gap-4 p-6">
				<Tabs defaultValue="attending">
					<TabsList className={"w-full"}>
						<TabsTrigger className={"w-full"} value="attending">
							Attending
							{/* <small className={styles.attendingCount}>{attendingCount}</small> */}
						</TabsTrigger>
						<TabsTrigger className={"w-full"} value="invited">
							Invited
							{/* <small className={styles.inviteCount}>{invitedCount}</small> */}
						</TabsTrigger>
						<TabsTrigger className={"w-full"} value="declined">
							Declined
							{/* <small className={styles.declinedCount}>{declinedCount}</small> */}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="attending">
						{attendingUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />
						})}
					</TabsContent>
					<TabsContent value="invited">
						{invitedUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />
						})}
					</TabsContent>
					<TabsContent value="declined">
						{declinedUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />
						})}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}

interface AttendeeCardProps {
	user: Profile,
}

function AttendeeCard({ user }: AttendeeCardProps) {
	return <div className="flex items-center gap-2 ml-2">
		<Avatar>
			<AvatarImage src={user.avatarUrl ?? undefined} />
			<AvatarFallback>{user.username ?? "user".substring(0, 2)}</AvatarFallback>
		</Avatar>
		<div className={styles.userName}>{user.username ?? "user"}</div>
	</div>
}

