"use client"
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Check, Trash } from "lucide-react";
import { acceptFriendRequest, addFriend, FriendStatusAndProfile, removeFriend } from "@/actions/friendActions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NotUndefined, WithoutArray } from "@/utils/TypeUtils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Props {
	friends: FriendStatusAndProfile
}

const formSchema = z.object({
	username: z.string(),
})


export default function FriendList({ friends }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		}
	});

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {

		const friendChannel = supabase.channel('realtime-friendship').on('postgres_changes', {
			event: '*',
			schema: 'public',
			table: 'friendship'
		}, () => {
			router.refresh();
		}).subscribe();

		return () => {
			supabase.removeChannel(friendChannel)
		}
	}, [supabase, router])

	async function processForm(values: z.infer<typeof formSchema>) {
		const result = await addFriend(values.username)
		if (result && !result.success) {
			form.setError("username", { message: result.error }, { shouldFocus: true })
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<Form {...form} >
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
									<Button type='submit'>Add</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>

			<Separator />
			<Label>Friend list</Label>

			{friends !== undefined && friends.map((friendship) => {
				if (friendship === undefined) return;
				return <FriendButton key={friendship.id} friendship={friendship} />
			})}
		</div>
	)
}

interface FriendButtonProps {
	friendship: NotUndefined<WithoutArray<FriendStatusAndProfile>>
}

function FriendButton({ friendship }: FriendButtonProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<Avatar >
					<AvatarImage src={friendship.profile.avatarUrl ?? undefined} />
					<AvatarFallback>{friendship.profile.username!.substring(0, 2)}</AvatarFallback>
				</Avatar>
				{<div className={`flex flex-col`}>
					<span>{friendship.profile.username}</span>
					{friendship.status === "pending" && <span className="text-xs">{friendship.incoming ? "pending" : "waiting for response"}</span>}
				</div>}
			</div>

			{(friendship.status === "pending" && friendship.incoming) && <Button size={"icon"} variant={"secondary"} className="group hover:bg-blue-600" onClick={async () => {
				await acceptFriendRequest(friendship.id)
			}}><Check className="group-hover:stroke-white stroke-gray-700" /></Button>}

			{((friendship.status === "pending" && !friendship.incoming) || friendship.status === "accepted") && <AlertDialog>
				<AlertDialogTrigger asChild>
					<Button size={"icon"} variant={"secondary"} className="hover:bg-red-500"><Trash className="stroke-gray-700" /></Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove friend?</AlertDialogTitle>
						<AlertDialogDescription>
							{friendship.status === "pending" ?
								"Do you want to cancel this friend request?"
								: "Are you sure you want to remove this friend, you cannot invite them to events without re adding them"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={async () => {
							await removeFriend(friendship.id)
						}}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>}
		</div>
	)
}

