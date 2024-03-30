import { getIncomingRequests as getIncomingFriendRequests } from "@/app/addfriend/actions";
import FriendRequestCard from "@/components/friends/friendRequestCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox } from "lucide-react";

export default async function InboxPopover() {
	const requests = await getIncomingFriendRequests();
	const nofifications = 5;
	const notificationCount = (requests?.length ?? 0) + nofifications;
	const notificationText = notificationCount > 0 ? notificationCount < 99 ? notificationCount : "99+" : undefined;

	return <Popover>
		<PopoverTrigger asChild>
			<Button variant="outline" className={`gap-2 pl-4 pr-4 h-10 rounded-full `}>
				<Inbox className="w-6 h-5" color="rgb(2,8,23)" />
				{notificationText}
			</Button>
		</PopoverTrigger>
		<PopoverContent className="w-auto">
			<div className="flex flex-row items-center">
				<h2 className="text-sm font-semibold">Inbox</h2>
			</div>
			<Tabs defaultValue="messages">
				<TabsList className="flex ">
					<TabsTrigger value="messages" className="flex gap-2">
						Messages
						<Badge variant="default" className="pl-2 pr-2">{nofifications}</Badge>
					</TabsTrigger>
					<TabsTrigger value="requests" className="flex gap-2">
						Requests
						{requests !== undefined && requests.length > 0 && <Badge variant="secondary" className="pl-2 pr-2">{requests?.length}</Badge>}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="messages">
					<div>
						<div>messages</div>
					</div>
				</TabsContent>
				<TabsContent value="requests">
					{(requests !== undefined && requests.length > 0) ? requests?.map((user) => {
						return <FriendRequestCard user={user} key={`out-${user.id}`} />
					}) : <h2 className="text-sm font-semibold">no pending friend requests</h2>}
				</TabsContent>
			</Tabs>
		</PopoverContent>
	</Popover>
}