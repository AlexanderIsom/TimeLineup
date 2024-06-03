"use client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InboxIcon } from "lucide-react";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Inbox from "./inbox";
import { useNotificationStore } from "@/store/Notifications";

export default function InboxPopover() {
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
		<Popover>
			<PopoverTrigger asChild>
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
					<Inbox />
				</div>
			</PopoverContent>
		</Popover>
	);
}
