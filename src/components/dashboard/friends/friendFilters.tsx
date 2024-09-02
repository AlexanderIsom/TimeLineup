"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { Tables } from "@/lib/supabase/database.types";
import { getFriends } from "@/lib/supabase/queries/getFriends";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { User, UserPlus } from "lucide-react";
import { useQueryState } from "nuqs";
import AddFriendForm from "./addFriendForm";

interface Props {
	profile: Tables<"profile">
}

export default function FriendFilters({ profile }: Props) {
	const supabase = useSupabaseBrowser()
	const { data: friends } = useQuery(getFriends(supabase))
	const [filter, setFilter] = useQueryState("filter");

	let content: React.ReactNode;
	if (!friends || friends.length === 0) {
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
			{friends.filter((friend) => {
				if (filter === null) return true;
				if (friend.sending_user === profile.id && friend.status === "pending" && filter === "outgoing") return true;
				if (friend.receiving_user === profile.id && friend.status === "pending" && filter === "incoming") return true;
				return friend.status === filter;
			}).map((friend, i) => {
				if (!friend.receiving_user_profile || !friend.sending_user_profile) return;
				const filteredFriend = friend.sending_user_profile.id === profile.id ? friend.receiving_user_profile : friend.sending_user_profile;
				return <div key={i}>
					<div className="flex gap-2">
						<div className=" flex gap-2 items-center">
							<Avatar className="not-prose size-16">
								<AvatarImage src={filteredFriend!.avatar_url ?? undefined} />
								<AvatarFallback>
									<User />
								</AvatarFallback>
							</Avatar>
							<h2 className="m-0">
								{filteredFriend.username}
							</h2>
							<h3 className="m-0">
								{friend.status}
							</h3>
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