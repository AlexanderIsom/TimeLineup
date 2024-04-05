import { FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery } from "@/actions/notificationAction";
import FriendRequests from "./friendRequests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox } from "lucide-react";
import Messages from "./messages";

interface Props {
	friendRequests: FriendStatusAndProfile
	notifications: NotificationQuery
}

export default async function InboxPopover({ friendRequests, notifications }: Props) {
	const friendRequestCount = (friendRequests?.length ?? 0);
	const notificationsCount = (notifications?.length ?? 0);
	const messageCount = friendRequestCount + notificationsCount;
	const messageText = messageCount > 0 ? messageCount < 99 ? messageCount : "99+" : undefined;

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
							<Badge variant="secondary" className="pl-2 pr-2">{friendRequests?.length}</Badge>}
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