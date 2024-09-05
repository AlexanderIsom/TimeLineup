"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { Tables } from "@/lib/supabase/database.types";
import { deleteFriendRequest, getFriends } from "@/lib/supabase/queries/getFriends";
import { useQuery, useDeleteItem, useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { Check, Trash, User, UserPlus, X } from "lucide-react";
import { useQueryState } from "nuqs";
import AddFriendForm from "./addFriendForm";
import { QueryData } from "@supabase/supabase-js";
import { WithoutArray } from "@/utils/TypeUtils";
import { useMemo } from "react";
import { revalidatePath } from "next/cache";
import { useMutation } from "@tanstack/react-query";

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
		})
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
								- {friend.status}
							</h3>
							{friend.status === RequestStatus.outgoing && <>
								<Button variant={"ghost"} size={"icon"} onClick={() => {
									deleteFriend({ id: friend.id })
								}}>
									<X />
								</Button>
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