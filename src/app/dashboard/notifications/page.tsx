"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, MailOpen, User } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
	const queryClient = useQueryClient();
	const supabase = useSupabaseBrowser();

	const { data: notifications, isLoading, isPending } = useQuery({
		queryKey: ["getNotifications"],
		queryFn: async () => {
			const { data } = await supabase.from("notification").select("*, sending_profile:profile!public_notification_sender_fkey(*)")
			return data;
		}, refetchInterval: 10000
	})

	const deleteNotification = useMutation({
		mutationFn: async (id: number) => {
			const { data } = await supabase.from("notification").delete().eq("id", id)
			return data;
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
		}
	})

	let content;

	if (isPending) {
		content = <div>loading...</div>
	} else if (!notifications || notifications.length === 0) {
		content = <div className="size-full flex flex-col gap-2 justify-center items-center text-center">
			<div className="bg-gray-200 rounded-full p-4">
				<Bell className="size-8" />
			</div>
			<div className="flex flex-col gap-1 text-center items-center justify-center">
				<h3 className="m-0">No notifications</h3>
				<p className="m-0 text-wrap w-3/4">You have no new or unread notifications</p>
			</div>
		</div>

	} else {
		content = notifications?.map((notification) => {
			return <div key={notification.id} className="flex gap-2 items-center w-full">
				<Button key={notification.id} variant={"ghost"} asChild className="w-full not-prose flex justify-start px-2 py-6">
					<Link className="flex gap-2 " href={notification.type === "event" ? `/dashboard/events/${notification.event_id}` : `/dashboard/friends`}>
						<Avatar className="size-8">
							<AvatarImage src={notification.sending_profile?.avatar_url ?? undefined} />
							<AvatarFallback className="bg-gray-200">
								<User />
							</AvatarFallback>
						</Avatar>
						{notification.type === "event" && `${notification.sending_profile?.username} invited you to an event`}
						{notification.type === "friend" && `${notification.sending_profile?.username} sent you a friend request`}
					</Link>
				</Button>
				<Button variant={"ghost"} size={"icon"} className="text-gray-200" onClick={() => {
					deleteNotification.mutate(notification.id)
				}}>
					<MailOpen />
				</Button>
			</div>
		})
	}

	return <div className="p-4 prose space-y-4 min-w-full flex flex-col col-start-2 col-end-3 ">
		<div>
			<h3 className="m-0">
				Notifications
			</h3>
			<p className="m-0">
				see and manage your notifiations.
			</p>
		</div>
		<Card className="h-full p-4 flex flex-col">
			{content}
		</Card>
	</div>
}