"use client"
import styles from "./EventDetails.module.scss";
import { formatDateRange } from "@/utils/dateUtils"
import { AgendaItem, EventData } from "@/lib/types/Events"
import React, { useMemo, useState } from "react";
import { addMinutes, format } from "date-fns";
import Image from "next/image"
import { Profile, RsvpStatus, rsvpStatus } from "@/db/schema";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventWithRsvpAndUser } from "@/db/schemaTypes";
import { CalendarRange, Check, CircleHelp, Cross, User, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EventDataQuery } from "@/actions/eventActions";
import { NotUndefined } from "@/utils/TypeUtils";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import UpdateEventDialog from "../events/newEventForm/updateEventDialog";
import { updateRsvpStatus } from "@/actions/idActions";

interface Props {
	event: NotUndefined<EventDataQuery>
	localUser: Profile
}

export default function EventDetails({ event, localUser }: Props) {
	const declinedUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "declined";
	}), [event]);

	const attendingUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "attending";
	}), [event]);

	const invitedUsers = useMemo(() => event.rsvps.filter((reponse) => {
		return reponse.status === "pending";
	}), [event]);

	const isHost = event.userId === localUser.id
	const [localRsvp, setLocalRsvp] = useState(event.rsvps.find(r => r.userId === localUser.id))

	const updateStatus = async (state: RsvpStatus) => {
		await updateRsvpStatus(event.id, state);
	}

	return (
		<Card className={`flex flex-col w-full mx-auto shadow-lg ${styles.wrapper}`}>
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
			<CardContent className="flex items-center justify-between pl-6 pr-6">
				{isHost ?
					<UpdateEventDialog event={event} />
					:
					<div className="flex justify-between items-center w-full">
						<Button size="lg" variant={"ghost"} className={`flex w-full h-auto ${localRsvp!.status === "attending" && "bg-blue-200"}`}
							onClick={() => {
								updateStatus("attending");
							}}>
							<div className="flex flex-col w-full items-center m-2 gap-1">
								<Check className="h-full" />
								<div className="min-w-max h-full">Going</div>
							</div>
						</Button>

						<Button size="lg" variant={"ghost"} className={`flex w-full h-auto ${localRsvp!.status === "pending" && "bg-blue-200"}`}
							onClick={() => {
								updateStatus("pending");
							}}>
							<div className="flex flex-col w-full items-center m-2 gap-1">
								<CircleHelp className="h-full" />
								<div className="min-w-max h-full">Maybe</div>
							</div>
						</Button>

						<Button size="lg" variant={"ghost"} className={`flex w-full h-auto ${localRsvp!.status === "declined" && "bg-blue-200"}`}
							onClick={() => {
								updateStatus("declined");
							}}>
							<div className="flex flex-col w-full items-center m-2 gap-1">
								<X className="h-full" />
								<div className="min-w-max h-full">Can&apos;t go</div>
							</div>
						</Button>
					</div>}

			</CardContent>
			<CardContent className="flex flex-col gap-4 p-6">
				<Tabs defaultValue="invited">
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
			<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
		</Avatar>
		<div className={styles.userName}>{user.username ?? "user"}</div>
	</div>
}

