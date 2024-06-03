import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendRequests from "./friendRequests";
import { Badge } from "@/components/ui/badge";
import Messages from "./messages";
import { useNotificationStore } from "@/store/Notifications";
import { useShallow } from "zustand/react/shallow";

export default function Inbox() {
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
