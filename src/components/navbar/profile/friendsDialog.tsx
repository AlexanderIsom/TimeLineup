"use client"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ManageFriends from "./manageFriends";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { InboxIcon, Inbox, ContactRound } from "lucide-react";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

export default function FriendsDialog({ open, onClose, children }: Props) {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	if (isDesktop) {
		return <Dialog open={open} onOpenChange={(state) => {
			if (!state) {
				onClose?.();
			}
		}}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader >
					<DialogTitle className="flex gap-2 items-center">Manage friends</DialogTitle>
				</DialogHeader>
				<ManageFriends />
			</DialogContent>
		</Dialog>
	}

	return <Drawer open={open} onOpenChange={(state) => {
		if (!state) {
			onClose?.();
		}
	}}>
		<DrawerTrigger asChild>
			{children}
		</DrawerTrigger>
		<DrawerContent className="px-4 h-1/2">
			<DrawerHeader>
				<DrawerTitle>
					Manage friends
				</DrawerTitle>
			</DrawerHeader>
			<ManageFriends />
		</DrawerContent>
	</Drawer >
}