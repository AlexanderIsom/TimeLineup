"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
	const supabase = useSupabaseBrowser();

	const { data: notifications, isLoading, isPending } = useQuery({
		queryKey: ["getNotifications"],
		queryFn: async () => {
			const { data } = await supabase.from("notification").select("*, sending_profile:profile!public_notification_sender_fkey(*)")
			return data;
		}, refetchInterval: 10000
	})

	let content;

	if (isPending) {
		content = <div>loading...</div>
	} else {
		content = notifications?.map((notification) => {
			return <Button key={notification.id} variant={"ghost"} asChild className="w-full not-prose flex justify-start px-2 py-6">
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
		})
	}

	return <div className="p-4 prose space-y-4 min-w-full flex flex-col col-start-2 col-end-3 ">
		<div>
			<h3 className="m-0">
				Friends
			</h3>
			<p className="m-0">
				see and manage your friends.
			</p>
		</div>
		<Card className="h-full p-4 flex flex-col">
			{content}
		</Card>
	</div>
}