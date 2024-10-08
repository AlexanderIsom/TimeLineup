"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxIcon, MailOpen, User } from "lucide-react";
import Link from "next/link";

export default function Inbox() {
	const queryClient = useQueryClient();
	const supabase = useSupabaseBrowser();

	const { data: notifications } = useQuery({
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
						})}
					</div>
				</PopoverContent>
			</Popover>

		</>
	);
}
