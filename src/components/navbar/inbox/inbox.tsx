"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";

export default function Inbox() {
	const supabase = useSupabaseBrowser();

	const { data: notifications } = useQuery({
		queryKey: ["getNotifications"], queryFn: async () => {
			const { data } = await supabase.from("notification").select("*")
			return data;
		}
	})

	const count = notifications?.length ?? 0;

	return (
		<>
			<Popover>
				<PopoverTrigger asChild className="hidden md:block">
					<Button variant="outline" className="h-10 gap-2 rounded-full pl-4 pr-4">
						<div className="flex gap-2">
							<InboxIcon className="h-5 w-6" color="rgb(2,8,23)" />
							{count > 0 && (count > 99 ? "99+" : count)}
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="min-w-[300px]">
					<div className="flex flex-col gap-2 not-prose">
						<div className="flex items-center justify-center">
							<InboxIcon className="mr-2 h-4 w-4" />
							<span>Inbox</span>
						</div>
						<Separator />
						{count === 0 && <div className="text-xs text-center">No notifications</div>}
						{notifications?.map((notification) => {
							return <div key={notification.id}>{notification.type}</div>
						})}
					</div>
				</PopoverContent>
			</Popover>

		</>
	);
}
