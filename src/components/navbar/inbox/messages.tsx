"use client"
import { NotificationQuery, markNoticiationAsRead } from "@/actions/notificationAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";
import { useState } from "react";

interface Props {
	notifications: NotificationQuery
}

export default function Messages(props: Props) {
	const [notifications, setNotifications] = useState(props.notifications);

	if (notifications === undefined || notifications.length <= 0) {
		return <h2 className="text-sm font-semibold">no messages</h2>
	}

	return (
		<div>
			{notifications.map((notification) => {
				return <div key={notification.id} className="flex justify-between gap-2 items-center">
					<div className="flex gap-2 items-center">
						<div className='flex items-center gap-4'>
							<Avatar>
								<AvatarImage src={notification.sender.avatarUrl ?? undefined} />
								<AvatarFallback>{notification.sender.username!.substring(0, 2)}</AvatarFallback>
							</Avatar>
						</div>
						<div className="items-center">
							<div className="text-sm">
								Invite - {notification.sender.username}
							</div>

							<span className="text-xs">
								{notification.event!.start.toDateString()}
							</span>
						</div>
					</div>
					<Button size={"icon"} variant={"ghost"} className="w-8 h-8" onClick={async () => {
						setNotifications(notifications.filter(n => n.id !== notification.id))
						await markNoticiationAsRead(notification.id);
					}}><MailOpen className="stroke-gray-600" /></Button>
				</div>
			})}
		</div>
	)
}