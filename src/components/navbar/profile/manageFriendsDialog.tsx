"use client";
import { z } from "zod";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Trash, X } from "lucide-react";
import useSWR from "swr";

const formSchema = z.object({
	username: z.string(),
});

interface Props {
	children?: React.ReactNode;
	dialogProps?:{}
}

export default function ManageFriendsDialog({ children, dialogProps }: Props) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	if (isDesktop) {
		return (
			<Dialog
				{...dialogProps}
			>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="w-11/12 sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">Manage friends</DialogTitle>
					</DialogHeader>
					<FriendsList />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="h-1/2 px-4">
				<DrawerHeader>
					<DrawerTitle>Manage friends</DrawerTitle>
				</DrawerHeader>
				<FriendsList />
			</DrawerContent>
		</Drawer>
	);
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function FriendsList(){
	const { data: friends } = useSWR("/api/friends", fetcher);
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
