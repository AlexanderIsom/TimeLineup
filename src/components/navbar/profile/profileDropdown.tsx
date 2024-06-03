"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartHandshake, LogOut, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProfileForm from "./profileForm";
import { Suspense, useCallback, useState } from "react";
import ManageFriends from "./manageFriends";
import { useFriends, useProfile } from "@/swr/swrFunctions";
import ProfileDialog from "./profileDialog";
import FriendsDialog from "./friendsDialog";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { signOut } from "@/actions/auth";
import { ProfileAvatar, ProfileAvatarFallback } from "./profileAvatar";
import { useDialog } from "@/components/hooks/useDialog";
import { Button } from "@/components/ui/button";

export default function ProfileDropdown() {
	// const { profile } = useProfile();
	// const [dialogOption, setDialogOption] = useState<string>();

	const profileDialog = useDialog();
	// const friendsFialog = useDialog();

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<Suspense fallback={<ProfileAvatarFallback iconOnly={true} />}>
						{/* trying to load this */}
						<ProfileAvatar iconOnly={true} />
					</Suspense>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-80">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="hover:cursor-pointer" {...profileDialog.triggerProps}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer">
						<HeartHandshake className="mr-2 h-4 w-4" />
						<span>Manage friends</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<form action="/auth/signout" method="POST">
						<DropdownMenuItem className="w-full hover:cursor-pointer" asChild>
							<button type="submit">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</button>
						</DropdownMenuItem>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog {...profileDialog.dialogProps}>
				<DialogContent className="w-11/12 px-4 sm:max-w-md md:px-6">
					<DialogHeader className="flex flex-col items-center space-y-2">
						{/* <ProfileAvatar /> */}
						<DialogDescription>Change your profile picture and username here.</DialogDescription>
					</DialogHeader>
					{/* <ProfileForm /> */}
				</DialogContent>
			</Dialog>

			{/* <ProfileDialog
				open={dialogOption === "profile"}
				onClose={() => {
					setDialogOption(undefined);
				}}
			/> */}

			{/* <FriendsDialog
				open={dialogOption === "friends"}
				onClose={() => {
					setDialogOption(undefined);
				}}
			/> */}
		</>
	);
}
