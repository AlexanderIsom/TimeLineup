"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendRequests from "./friendRequests";
import { Badge } from "@/components/ui/badge";
import Messages from "./messages";
import { useNotificationStore } from "@/store/Notifications";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function Inbox() {
	const messageCount = useNotificationStore((state) => state.totalNotificaionCount);
	const messageText = messageCount > 0 ? (messageCount < 99 ? messageCount : "99+") : undefined;

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const notificationChannel = supabase
			.channel("realtime-notifications")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notification",
				},
				() => {
					router.refresh();
				},
			)
			.subscribe();

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
			supabase.removeChannel(notificationChannel);
			supabase.removeChannel(friendChannel);
		};
	}, [supabase, router]);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild className="hidden sm:block">
					<Button variant="outline" className={`h-10 gap-2 rounded-full pl-4 pr-4`}>
						<InboxIcon className="h-5 w-6" color="rgb(2,8,23)" />
						{messageText}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="min-w-[300px]">
					<div className="flex flex-col gap-2">
						<div className="flex flex-row items-center">
							<InboxIcon className="mr-2 h-4 w-4" />
							<span>Inbox</span>
						</div>
						<InboxTabs />
					</div>
				</PopoverContent>
			</Popover>

			<Drawer>
				<DrawerTrigger asChild className="flex sm:hidden">
					<div className="flex items-center font-medium hover:cursor-pointer hover:underline">
						<InboxIcon className="mr-2 h-4 w-4" />
						<span>Inbox {messageText}</span>
					</div>
				</DrawerTrigger>
				<DrawerContent className="h-1/2 px-4">
					<DrawerHeader>
						<DrawerTitle>Inbox</DrawerTitle>
					</DrawerHeader>
					<Inbox />
				</DrawerContent>
			</Drawer>
		</>
	);
}

function InboxTabs() {
	const [notifications, friendRequests] = useNotificationStore(
		useShallow((state) => [state.notifications, state.friendRequests]),
	);
	return (
		<Tabs defaultValue="messages">
			<TabsList className="flex">
				<TabsTrigger value="messages" className="flex w-full gap-2">
					Messages
					{notifications && notifications.length > 0 && (
						<Badge variant="default" className="pl-2 pr-2">
							{notifications.length}
						</Badge>
					)}
				</TabsTrigger>
				<TabsTrigger value="requests" className="flex w-full gap-2">
					Requests
					{friendRequests && friendRequests.length > 0 && (
						<Badge variant="secondary" className="pl-2 pr-2">
							{friendRequests.length}
						</Badge>
					)}
				</TabsTrigger>
			</TabsList>

			<div className="flex min-h-32 flex-col overflow-y-auto overflow-x-hidden">
				<TabsContent value="messages">
					<Messages notifications={notifications} />
				</TabsContent>
				<TabsContent value="requests">
					<FriendRequests requests={friendRequests} />
				</TabsContent>
			</div>
		</Tabs>
	);
}
