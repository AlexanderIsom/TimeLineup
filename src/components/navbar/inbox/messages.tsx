"use client";
import { NotificationQuery, markNoticiationAsRead } from "@/actions/notificationAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/Notifications";
import { MailOpen, User } from "lucide-react";

interface Props {
	notifications: NotificationQuery;
}

export default function Messages({ notifications }: Props) {
	const store = useNotificationStore((state) => state);

	if (notifications === undefined || notifications.length <= 0) {
		return <h2 className="text-sm font-semibold">no messages</h2>;
	}
	async function onSubmit(id: string) {
		store.removeNotification(id);
		await markNoticiationAsRead(id);
	}

	return (
		<div>
			{notifications.map((notification) => {
				return (
					<form key={notification.id} className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src={notification.sender.avatarUrl ?? undefined} />
									<AvatarFallback className="bg-gray-200">
										<User />
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="items-center">
								<div className="text-sm">Invite - {notification.sender.username}</div>

								<span className="text-xs">{notification.event!.start.toDateString()}</span>
							</div>
						</div>
						<Button
							size={"icon"}
							variant={"ghost"}
							className="h-8 w-8"
							formAction={() => {
								onSubmit(notification.id);
							}}
						>
							<MailOpen className="stroke-gray-600" />
						</Button>
					</form>
				);
			})}
		</div>
	);
}
