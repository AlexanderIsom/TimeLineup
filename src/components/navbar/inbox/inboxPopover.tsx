import { FriendStatusAndProfile } from "@/actions/friendActions";
import FriendRequests from "@/components/friends/friendRequests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox } from "lucide-react";

interface Props {
	friendRequests: FriendStatusAndProfile
}

export default async function InboxPopover({ friendRequests }: Props) {
	const nofifications = 5;
	const notificationCount = (friendRequests?.length ?? 0) + nofifications;
	const notificationText = notificationCount > 0 ? notificationCount < 99 ? notificationCount : "99+" : undefined;

	return <Popover>
		<PopoverTrigger asChild>
			<Button variant="outline" className={`gap-2 pl-4 pr-4 h-10 rounded-full `}>
				<Inbox className="w-6 h-5" color="rgb(2,8,23)" />
				{notificationText}
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
						<Badge variant="default" className="pl-2 pr-2">{nofifications}</Badge>
					</TabsTrigger>
					<TabsTrigger value="requests" className="flex gap-2 w-full">
						Requests
						{friendRequests !== undefined && friendRequests.length > 0 && <Badge variant="secondary" className="pl-2 pr-2">{friendRequests?.length}</Badge>}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="messages">
					<div>
						<h2 className="text-sm font-semibold">no messages</h2>
					</div>
				</TabsContent>
				<TabsContent value="requests">
					<FriendRequests requests={friendRequests} />
				</TabsContent>
			</Tabs>
		</PopoverContent>
	</Popover>
}