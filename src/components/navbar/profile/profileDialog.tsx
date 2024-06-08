"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProfileAvatar } from "./profileAvatar";

import ProfileForm from "./profileForm";

interface Props {
	children?: React.ReactNode;
	dialogProps?: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	};
}

interface Props {
	onCancel?: () => void;
}

export function ProfileDialog({ children, dialogProps }: Props) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog {...dialogProps}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="w-11/12 px-4 sm:max-w-md md:px-6">
					<DialogHeader className="flex flex-col items-center space-y-2">
						<ProfileAvatar />
						<DialogDescription>Change your profile picture and username here.</DialogDescription>
					</DialogHeader>
					<ProfileForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader className="flex flex-col items-center space-y-2">
					<ProfileAvatar />
					<DrawerDescription>Change your profile picture and username here.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm />
			</DrawerContent>
		</Drawer>
	);
}
