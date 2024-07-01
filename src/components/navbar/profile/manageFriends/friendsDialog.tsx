import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import FriendsList from "./friendsList";
import QueryDialog from "@/components/queryDialog";
import { FriendStatusAndProfiles, getFriendshipsWithStatus } from "@/actions/friendActions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import QueryDrawer from "@/components/queryDrawer";

export default async function FriendsDialog() {
	const friends = await getFriendshipsWithStatus();
	return <FriendsContent friends={friends} />;
}

interface ContentProps {
	friends: FriendStatusAndProfiles;
}

function FriendsContent({ friends }: ContentProps) {
	"use client";

	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<QueryDialog dialogId="friends">
				<DialogContent className="w-11/12 sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">Manage friends</DialogTitle>
					</DialogHeader>
					<FriendsList friends={friends} />
				</DialogContent>
			</QueryDialog>
		);
	}

	return (
		<QueryDrawer drawerId="friends">
			<DrawerContent className="h-1/2 px-4">
				<DrawerHeader>
					<DrawerTitle>Manage friends</DrawerTitle>
				</DrawerHeader>
				<FriendsList friends={friends} />
			</DrawerContent>
		</QueryDrawer>
	);
}

interface DrawerProps {
	children?: React.ReactNode;
}

export async function ManageFriendsDrawer({ children }: DrawerProps) {
	const friends = await getFriendshipsWithStatus();
	return (
		<Drawer>
			<DrawerTrigger asChild className="flex md:hidden">
				{children}
			</DrawerTrigger>
			<DrawerContent className="h-1/2 px-4">
				<DrawerHeader>
					<DrawerTitle>Manage friends</DrawerTitle>
				</DrawerHeader>
				<FriendsList friends={friends} />
			</DrawerContent>
		</Drawer>
	);
}
