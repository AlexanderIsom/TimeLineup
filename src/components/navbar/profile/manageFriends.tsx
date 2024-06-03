"use client";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Check, Cross, Trash, X } from "lucide-react";
import { acceptFriendRequest, addFriend, FriendStatusAndProfile, removeFriend } from "@/actions/friendActions";
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
} from "@/components/ui/alert-dialog";
import { NotUndefined, WithoutArray } from "@/utils/TypeUtils";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useFriends } from "@/swr/swrFunctions";

const formSchema = z.object({
	username: z.string(),
});

export default function ManageFriends() {
	const { friends } = useFriends();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

	const router = useRouter();
	const supabase = createClient();

	const [currentFriends, setCurrentFriends] = useState<FriendStatusAndProfile>();
	useMemo(() => setCurrentFriends(friends), [friends]);

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

			{currentFriends !== undefined &&
				currentFriends.map((friendship) => {
					if (friendship === undefined) return;
					return (
						<FriendButton
							key={friendship.id}
							friendship={friendship}
							onRemoveFriend={async (friendToRemove) => {
								setCurrentFriends(currentFriends.filter((f) => f.id !== friendToRemove.id));
								await removeFriend(friendToRemove.id);
							}}
						/>
					);
				})}
		</div>
	);
}

interface FriendButtonProps {
	friendship: NotUndefined<WithoutArray<FriendStatusAndProfile>>;
	onRemoveFriend: (friend: NotUndefined<WithoutArray<FriendStatusAndProfile>>) => void;
}

function FriendButton({ friendship, onRemoveFriend }: FriendButtonProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={friendship.profile.avatarUrl ?? undefined} />
					<AvatarFallback>{friendship.profile.username!.substring(0, 2)}</AvatarFallback>
				</Avatar>
				{
					<div className={`flex flex-col`}>
						<span>{friendship.profile.username}</span>
						{friendship.status === "pending" && (
							<span className="text-xs">{friendship.incoming ? "pending" : "waiting for response"}</span>
						)}
					</div>
				}
			</div>

			<div className="flex gap-2">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size={"icon"} variant={"secondary"} className="group hover:bg-red-500">
							{friendship.status === "pending" && friendship.incoming ? (
								<X className="group-hover:stroke-white" />
							) : (
								<Trash className="stroke-gray-700 group-hover:stroke-white" />
							)}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Remove friend ?</AlertDialogTitle>
							<AlertDialogDescription>
								{friendship.status === "pending"
									? `Do you want to ${friendship.incoming ? "reject" : "cancel"} this friend request ?`
									: "Are you sure you want to remove this friend, you cannot invite them to events without re adding them"}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onRemoveFriend(friendship);
								}}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{friendship.status === "pending" && friendship.incoming && (
					<Button
						size={"icon"}
						variant={"secondary"}
						className="group hover:bg-blue-600"
						onClick={async () => {
							await acceptFriendRequest(friendship.id);
						}}
					>
						<Check className="stroke-gray-700 group-hover:stroke-white" />
					</Button>
				)}
			</div>
		</div>
	);
}
