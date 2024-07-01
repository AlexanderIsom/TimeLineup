import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import FriendsList from "./friendsList";
import QueryDialog from "@/components/queryDialog";
import { getFriendshipsWithStatus } from "@/actions/friendActions";
import QueryDrawer from "@/components/queryDrawer";

export default async function FriendsModal() {
	const friends = await getFriendshipsWithStatus();

	return (
		<>
			<QueryDialog dialogId="friends">
				<DialogContent className="w-11/12 sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">Manage friends</DialogTitle>
					</DialogHeader>
					<FriendsList friends={friends} />
				</DialogContent>
			</QueryDialog>
			<QueryDrawer drawerId="friends">
				<DrawerContent className="h-1/2 px-4">
					<DrawerHeader>
						<DrawerTitle>Manage friends</DrawerTitle>
					</DrawerHeader>
					<FriendsList friends={friends} />
				</DrawerContent>
			</QueryDrawer>
		</>
	);
}
