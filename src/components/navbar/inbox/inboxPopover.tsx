"use client"
import { FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery } from "@/actions/notificationAction";
import FriendRequests from "./friendRequests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox } from "lucide-react";
import Messages from "./messages";
import { useEffect, useMemo, useOptimistic, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
	friends: FriendStatusAndProfile
	notifications: NotificationQuery
}

export default function InboxPopover(props: Props) {
	const notifications = useMemo(() => props.notifications?.filter(n => n.seen === false), [props.notifications])
	const friendRequests = useMemo(() => props.friends?.filter(f => f.status === "pending" && f.incoming), [props.friends])

	const friendRequestCount = (friendRequests?.length ?? 0);
	const notificationsCount = (notifications?.length ?? 0);
	const messageCount = friendRequestCount + notificationsCount;
	const messageText = messageCount > 0 ? messageCount < 99 ? messageCount : "99+" : undefined;

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const notificationChannel = supabase.channel('realtime-notifications').on('postgres_changes', {
			event: '*',
			schema: 'public',
			table: 'notification'
		}, () => {
			router.refresh();
		}).subscribe();

		const friendChannel = supabase.channel('realtime-friendship').on('postgres_changes', {
			event: '*',
			schema: 'public',
			table: 'friendship'
		}, () => {
			router.refresh();
		}).subscribe();

		return () => {
			supabase.removeChannel(notificationChannel)
			supabase.removeChannel(friendChannel)
		}
	}, [supabase, router])

	return <Popover>
		<PopoverTrigger asChild>
			<Button variant="outline" className={`gap-2 pl-4 pr-4 h-10 rounded-full `}>
				<Inbox className="w-6 h-5" color="rgb(2,8,23)" />
				{messageText}
			</Button>
		</PopoverTrigger>
		<PopoverContent className="min-w-[300px]">
			<div className="flex flex-row items-center">
				<h2 className="text-sm font-semibold">Inbox</h2>
			</div>
			<Tabs defaultValue="messages">
				<TabsList className="flex ">
					<TabsTrigger value="messages" className="flex gap-2 w-full">
						Messages
						{notificationsCount > 0 &&
							<Badge variant="default" className="pl-2 pr-2">{messageCount}</Badge>}
					</TabsTrigger>
					<TabsTrigger value="requests" className="flex gap-2 w-full">
						Requests
						{friendRequestCount > 0 &&
							<Badge variant="secondary" className="pl-2 pr-2">{friendRequestCount}</Badge>}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="messages">
					<Messages notifications={notifications} />
				</TabsContent>
				<TabsContent value="requests">
					<FriendRequests requests={friendRequests} />
				</TabsContent>
			</Tabs>
		</PopoverContent>
	</Popover>
}