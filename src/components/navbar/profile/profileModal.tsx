import { DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { ProfileAvatar, ProfileAvatarFallback } from "./profileAvatar";

import ProfileForm from "./profileForm";
import QueryDialog from "@/components/queryDialog";
import { Suspense } from "react";
import QueryDrawer from "@/components/queryDrawer";

export function ProfileModal() {
	return (
		<>
			<QueryDialog dialogId="profile">
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
			<QueryDrawer drawerId="profile">
				<DrawerContent className="p-4">
					<DrawerHeader className="flex flex-col items-center space-y-2">
						<Suspense fallback={<ProfileAvatarFallback />}>
							<ProfileAvatar />
						</Suspense>
						<DrawerDescription>Change your profile picture and username here.</DrawerDescription>
					</DrawerHeader>
					<ProfileForm />
				</DrawerContent>
			</QueryDrawer>
		</>
	);
}
