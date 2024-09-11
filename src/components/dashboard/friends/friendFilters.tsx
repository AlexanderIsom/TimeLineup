"use client"

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { Tables } from "@/lib/supabase/database.types";
import { getFriends } from "@/lib/supabase/queries/getFriends";
import { WithoutArray } from "@/utils/TypeUtils";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useDeleteMutation, useQuery, useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";
import { Check, Trash, User, UserPlus, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import AddFriendForm from "./addFriendForm";

interface Props {
	profile: Tables<"profile">
}

export enum RequestStatus {
	incoming,
	outgoing,
	accepted
}

type getFriendsReturnType = WithoutArray<Awaited<QueryData<ReturnType<typeof getFriends>>>>
export type reducedFriends = Pick<getFriendsReturnType, "id"> & { incoming: boolean, profile: Tables<"profile">, status: RequestStatus }

export default function FriendFilters({ profile }: Props) {
	const supabase = useSupabaseBrowser()
	const { mutateAsync: deleteFriend } = useDeleteMutation(supabase.from("friendship"), ["id"])
	const { mutateAsync: acceptFriend } = useUpdateMutation(supabase.from("friendship"), ["id"])
	const { data: friends } = useQuery(getFriends(supabase))

	const [filter, setFilter] = useQueryState("filter");

	const filteredFriends = useMemo(() => {
		return friends?.map((friend) => {
			const incoming = friend.receiving_user === profile.id;
			const targetProfile = incoming ? friend.sending_user_profile! : friend.receiving_user_profile!;
			let requestStatus = RequestStatus.accepted;
			if (friend.status === "pending") {
				requestStatus = incoming ? RequestStatus.incoming : RequestStatus.outgoing;
			}
			let newFriend: reducedFriends = { id: friend.id, incoming, status: requestStatus, profile: targetProfile }
			return newFriend
		}).sort((a, b) => a.profile.username!.localeCompare(b.profile.username!))
	}, [friends, profile])

	let content: React.ReactNode;
	if (!filteredFriends || filteredFriends.length === 0) {
		content = <div className="size-full flex flex-col gap-2 justify-center items-center text-center">
			<div className="bg-gray-200 rounded-full p-4">
				<UserPlus className="size-8" />
			</div>
			<div className="flex flex-col gap-1 text-center items-center justify-center">
				<h3 className="m-0">No friends</h3>
				<p className="m-0 text-wrap w-3/4">You havent added any friend, search for a user above or go to their profile to add them</p>
			</div>
		</div>
	} else {
		content = <div className="flex flex-col gap-2 w-full p-8">
			{filteredFriends.filter((friend) => {
				if (filter === null) return true;
				return RequestStatus[friend.status] === filter;
			}).map((friend, i) => {
				return <div key={i}>
					<div className="flex gap-2">
						<div className=" flex gap-2 items-center">
							<Avatar className="not-prose size-16">
								<AvatarImage src={friend.profile.avatar_url ?? undefined} />
								<AvatarFallback>
									<User />
								</AvatarFallback>
							</Avatar>
							<h2 className="m-0">
								{friend.profile.username}
							</h2>
							<h3 className="m-0">
								- {RequestStatus[friend.status]}
							</h3>
							{friend.status === RequestStatus.outgoing &&
								<Button variant={"ghost"} size={"icon"} onClick={() => {
									deleteFriend({ id: friend.id })
								}}>
									<X />
								</Button>
							}
							{friend.status === RequestStatus.incoming && <>
								<Button variant={"ghost"} size={"icon"} onClick={() => {
									acceptFriend({ id: friend.id, status: "accepted" })
								}}>
									<Check />
								</Button>
								<Button variant={"ghost"} size={"icon"} onClick={() => {
									deleteFriend({ id: friend.id })
								}}>
									<X />
								</Button>
							</>}
							{friend.status === RequestStatus.accepted && <>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant={"ghost"} size={"icon"}>
											<Trash />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Delete friend?
											</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this friend? this cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={() => {
												deleteFriend({ id: friend.id })
											}}>Delete</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</>}

						</div>
					</div>
				</div>
			})}
		</div>
	}

	return <>
		<AddFriendForm />
		<div className="flex gap-1">
			<Button variant={filter === null ? "secondary" : "ghost"} onClick={() => {
				setFilter(null);
			}}>
				All
			</Button>
			<Button variant={filter === "accepted" ? "secondary" : "ghost"} onClick={() => {
				setFilter("accepted");
			}}>
				Friends
			</Button>
			<Button variant={filter === "incoming" ? "secondary" : "ghost"} onClick={() => {
				setFilter("incoming");
			}}>
				Incoming
			</Button>
			<Button variant={filter === "outgoing" ? "secondary" : "ghost"} onClick={() => {
				setFilter("outgoing");
			}}>
				Outgoing
			</Button>
		</div>
		<Card className="w-full min-h-96">
			{content}
		</Card>
	</>

}