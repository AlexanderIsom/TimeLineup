"use client";

import { useNotificationStore } from "@/stores/notificationStore";

import { useEffect } from "react";
import useSupabaseBrowser from "@/utils/supabase/browser";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import useSWR from "swr";
import { getFriendshipsWithStatus } from "@/actions/friendActions";
import { getNotifications } from "@/actions/notificationAction";
import InboxTabs from "./tabs";

export default function Inbox() {
	const messageCount = useNotificationStore((state) => state.totalNotificaionCount);
	const messageText = messageCount > 0 ? (messageCount < 99 ? messageCount : "99+") : undefined;

	const router = useRouter();
	const supabase = useSupabaseBrowser();

	const { data: friends, isLoading: friendsLoading } = useSWR("getFreindRequests", getFriendshipsWithStatus);
	const { data: notifications, isLoading: notificationsLoading } = useSWR("getNotifications", getNotifications);

	const setInitialState = useNotificationStore((state) => state.setInitialState);

	useEffect(() => {
		if (!notificationsLoading && !friendsLoading) {
			setInitialState(
				notifications?.filter((n) => n.seen === false),
				friends?.filter((f) => f.status === "pending" && f.incoming),
			);
		}
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
	}, [supabase, router, friends, notifications, friendsLoading, notificationsLoading, setInitialState]);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild className="hidden md:block">
					<Button variant="outline" className="h-10 gap-2 rounded-full pl-4 pr-4">
						<div className="flex gap-2">
							<InboxIcon className="h-5 w-6" color="rgb(2,8,23)" />
							{messageText}
						</div>
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
					<InboxTabs />
				</DrawerContent>
			</Drawer>
		</>
	);
}
