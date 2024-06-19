"use client";
import { FriendStatusAndProfile, FriendStatusAndProfiles, removeFriend } from "@/actions/friendActions";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";
import { useEffect, useOptimistic } from "react";

import FriendButton from "./friendButton";
import AddFriendForm from "./addFriendForm";

enum OptimisticActionType {
	add,
	remove,
}

interface OptimisticAction {
	action: OptimisticActionType;
	friend: NonNullable<FriendStatusAndProfile>;
}

interface Props {
	friends: FriendStatusAndProfiles;
}

export default function FriendsList({ friends }: Props) {
	const [optimisticFriends, updateOptimisticFriends] = useOptimistic(friends, (state, update: OptimisticAction) => {
		if (!state) return;

		if (update.action === OptimisticActionType.add && update.friend !== undefined) {
			const newState = state;
			newState.push(update.friend);
			return newState;
		}

		if (update.action === OptimisticActionType.remove && update.friend !== undefined) {
			const newState = state.filter((friend) => friend.id !== update.friend.id);
			return newState;
		}

		return state;
	});

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const friendChannel = supabase
			.channel("realtime-friendship")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "friendship",
				},
				() => {
					router.refresh();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(friendChannel);
		};
	}, [supabase, router]);

	return (
		<div className="flex flex-col gap-4">
			<AddFriendForm />
			<Separator />
			<Label>Friend list</Label>

			{optimisticFriends !== undefined &&
				optimisticFriends.map((friendship) => {
					if (friendship === undefined) return;
					return (
						<FriendButton
							key={friendship.id}
							friendship={friendship}
							onRemoveFriend={async (friendToRemove: NonNullable<FriendStatusAndProfile>) => {
								updateOptimisticFriends({
									action: OptimisticActionType.remove,
									friend: friendToRemove,
								});
								await removeFriend(friendToRemove.id);
							}}
						/>
					);
				})}
		</div>
	);
}
