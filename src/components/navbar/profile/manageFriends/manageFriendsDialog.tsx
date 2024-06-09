import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import FriendsList from "./friendsList";

interface DialogProps {
	children?: React.ReactNode;
	dialogProps?: {};
}

export default function ManageFriendsDialog({ children, dialogProps }: DialogProps) {
	return (
		<Dialog {...dialogProps}>
			<DialogTrigger asChild className="hidden md:flex">
				{children}
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">Manage friends</DialogTitle>
				</DialogHeader>
				<FriendsList />
			</DialogContent>
		</Dialog>
	);
}

interface DrawerProps {
	children?: React.ReactNode;
}

export function ManageFriendsDrawer({ children }: DrawerProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild className="flex md:hidden">
				{children}
			</DrawerTrigger>
			<DrawerContent className="h-1/2 px-4">
				<DrawerHeader>
					<DrawerTitle>Manage friends</DrawerTitle>
				</DrawerHeader>
				<FriendsList />
			</DrawerContent>
		</Drawer>
	);
}
