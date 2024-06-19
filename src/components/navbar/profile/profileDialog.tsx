import { DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { ProfileAvatar, ProfileAvatarFallback } from "./profileAvatar";

import ProfileForm from "./profileForm";
import QueryDialog from "@/components/queryDialog";
import { Suspense } from "react";

export function ProfileDialog() {
	return (
		<QueryDialog query="dialog" value="profile">
			<DialogContent>
				<DialogHeader className="flex flex-col items-center space-y-2">
					<Suspense fallback={<ProfileAvatarFallback />}>
						<ProfileAvatar />
					</Suspense>
					<DialogDescription>Change your profile picture and username here.</DialogDescription>
				</DialogHeader>
				<ProfileForm />
			</DialogContent>
		</QueryDialog>
	);
}

interface DrawerProps {
	children: React.ReactNode;
}

export function ProfileDrawer({ children }: DrawerProps) {
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
