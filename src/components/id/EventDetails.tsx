"use client";
import { formatDateRange } from "@/utils/dateUtils";
import React, { useMemo, useState } from "react";
import { Profile, RsvpStatus } from "@/db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, CircleHelp, Info, User, X } from "lucide-react";
import { EventDataQuery, deleteEvent } from "@/actions/eventActions";
import { NotUndefined } from "@/utils/TypeUtils";
import { Button } from "../ui/button";
import { updateRsvpStatus } from "@/actions/idActions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import CreateEventDialog from "../events/newEventForm/createEventDialog";
import useSWR from "swr";
import { getFriends } from "@/actions/friendActions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Props {
	event: NotUndefined<EventDataQuery>;
	localUser: Profile;
}

export default function EventDetails({ event, localUser }: Props) {
	const declinedUsers = useMemo(
		() =>
			event.rsvps.filter((reponse) => {
				return reponse.status === "declined";
			}),
		[event],
	);

	const attendingUsers = useMemo(
		() =>
			event.rsvps.filter((reponse) => {
				return reponse.status === "attending";
			}),
		[event],
	);

	const invitedUsers = useMemo(
		() =>
			event.rsvps.filter((reponse) => {
				return reponse.status === "pending";
			}),
		[event],
	);

	const isHost = event.userId === localUser.id;
	const [localRsvp, setLocalRsvp] = useState(event.rsvps.find((r) => r.userId === localUser.id));

	const { data: friends, isLoading } = useSWR("getFriends", getFriends);

	const updateStatus = async (rsvpStatus: RsvpStatus) => {
		setLocalRsvp((state) => {
			return { ...state!, status: rsvpStatus };
		});
		await updateRsvpStatus(event.id, rsvpStatus);
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="fixed bottom-8 right-8 h-auto w-auto rounded-full" size={"icon"}>
					<Info className="h-12 w-12 p-2" />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex w-11/12 flex-col gap-4 px-4 md:w-auto md:px-8">
				<SheetHeader className="rounded-t-lg">
					<SheetTitle>Event Details</SheetTitle>
				</SheetHeader>

				<div className="flex items-start gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-center">
						<span className="text-2xl font-bold">{event.title!.substring(0, 2)}</span>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-bold">{event.title}</h3>
						<p className="text-sm font-medium leading-none">{formatDateRange(event.start, event.end)}</p>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-medium leading-none">Organizer</h3>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={event.host.avatarUrl!} />
							<AvatarFallback>{event.host.username!.substring(0, 2)}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium leading-none">{event.host.username}</span>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-medium leading-none">Description</h3>
					<div className="prose prose-sm max-w-none">
						<p className={`${event.description === "" && "text-sm"}`}>
							{event.description === "" ? "no description provided" : event.description}
						</p>
					</div>
				</div>

				{event.end > new Date() && (
					<>
						{isHost ? (
							<div className="flex w-full gap-2">
								<CreateEventDialog friendsList={friends} event={event} isEditing={true}>
									<Button disabled={isLoading} className="w-1/2">
										Edit
									</Button>
								</CreateEventDialog>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive" className="w-1/2">
											Delete
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this event.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<form>
												<AlertDialogAction
													formAction={() => {
														deleteEvent(event.id);
													}}
													type="submit"
												>
													Continue
												</AlertDialogAction>
											</form>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						) : (
							<div className="flex w-full items-center justify-between">
								<Button
									size="lg"
									variant={"ghost"}
									className={`flex h-auto w-1/3 ${localRsvp!.status === "attending" && "bg-blue-200"}`}
									onClick={() => {
										updateStatus("attending");
									}}
								>
									<div className="m-2 flex w-full flex-col items-center gap-1">
										<Check className="h-full" />
										<div className="h-full min-w-max">Going</div>
									</div>
								</Button>

								<Button
									size="lg"
									variant={"ghost"}
									className={`flex h-auto w-1/3 ${localRsvp!.status === "pending" && "bg-blue-200"}`}
									onClick={() => {
										updateStatus("pending");
									}}
								>
									<div className="m-2 flex w-full flex-col items-center gap-1">
										<CircleHelp className="h-full" />
										<div className="h-full min-w-max">Maybe</div>
									</div>
								</Button>

								<Button
									size="lg"
									variant={"ghost"}
									className={`flex h-auto w-1/3 ${localRsvp!.status === "declined" && "bg-blue-200"}`}
									onClick={() => {
										updateStatus("declined");
									}}
								>
									<div className="m-2 flex w-full flex-col items-center gap-1">
										<X className="h-full" />
										<div className="h-full min-w-max">Can&apos;t go</div>
									</div>
								</Button>
							</div>
						)}
					</>
				)}

				<Tabs defaultValue="invited">
					<TabsList className={"w-full"}>
						<TabsTrigger className={"w-full"} value="attending">
							Attending
						</TabsTrigger>
						<TabsTrigger className={"w-full"} value="invited">
							Invited
						</TabsTrigger>
						<TabsTrigger className={"w-full"} value="declined">
							Declined
						</TabsTrigger>
					</TabsList>
					<TabsContent value="attending" className="flex flex-col gap-2">
						{attendingUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />;
						})}
					</TabsContent>
					<TabsContent value="invited" className="flex flex-col gap-2">
						{invitedUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />;
						})}
					</TabsContent>
					<TabsContent value="declined" className="flex flex-col gap-2">
						{declinedUsers.map((attendee) => {
							return <AttendeeCard key={attendee.id} user={attendee.user} />;
						})}
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
}

interface AttendeeCardProps {
	user: Profile;
}

function AttendeeCard({ user }: AttendeeCardProps) {
	return (
		<div className="ml-2 flex items-center gap-2">
			<Avatar>
				<AvatarImage src={user.avatarUrl ?? undefined} />
				<AvatarFallback className="bg-gray-200">
					<User />
				</AvatarFallback>
			</Avatar>
			<div>{user.username ?? "user"}</div>
		</div>
	);
}
