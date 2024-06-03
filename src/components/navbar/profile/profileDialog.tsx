"use client";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileForm from "./profileForm";
import { useProfile } from "@/swr/swrFunctions";
import { User } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ProfileAvatar } from "./profileAvatar";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

export default function ProfileDialog({ children, open, onClose }: Props) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={(state: boolean) => {
					if (!state) {
						onClose?.();
					}
				}}
			>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="w-11/12 px-4 sm:max-w-md md:px-6">
					<DialogHeader className="flex flex-col items-center space-y-2">
						{/* <ProfileAvatar /> */}
						<DialogDescription>Change your profile picture and username here.</DialogDescription>
					</DialogHeader>
					<ProfileForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer
			open={open}
			onOpenChange={(state: boolean) => {
				if (!state) {
					onClose?.();
				}
			}}
		>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader>
					{/* <ProfileAvatar /> */}
					<DrawerDescription>Change your profile picture and username here.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm />
			</DrawerContent>
		</Drawer>
	);
}
