"use client";
import {
	FriendStatusAndProfile,
	FriendStatusAndProfiles,
	addFriend,
	getFriendshipsWithStatus,
	removeFriend,
} from "@/actions/friendActions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import FriendButton from "./friendButton";
const formSchema = z.object({
	username: z.string(),
});

enum OptimisticActionType {
	add,
	remove,
}

interface OptimisticAction {
	action: OptimisticActionType;
	friend: NonNullable<FriendStatusAndProfile>;
}

export default function FriendsList() {
	const { data: friends, isLoading } = useSWR<FriendStatusAndProfiles>("getFriends", getFriendshipsWithStatus);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

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

	async function processForm(values: z.infer<typeof formSchema>) {
		const result = await addFriend(values.username);
		if (result && !result.success) {
			form.setError("username", { message: result.error }, { shouldFocus: true });
		}
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(processForm)} className="flex gap-2">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>add by username</FormLabel>

								<div className="flex gap-2">
									<FormControl>
										<Input type="text" placeholder="Username" {...field} className="w-full" />
									</FormControl>
									<Button type="submit">Add</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>

			<Separator />
			<Label>Friend list</Label>

			{isLoading ? (
				<span>Loading...</span>
			) : (
				<>
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
				</>
			)}
		</div>
	);
}
