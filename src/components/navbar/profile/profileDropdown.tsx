"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartHandshake, LogOut, User } from "lucide-react";
import {ProfileDialog} from "./profileDialog";
import ManageFriendsDialog from "./manageFriendsDialog";
import { ProfileAvatar, ProfileAvatarFallback } from "./profileAvatar";
import { useDialog } from "@/components/hooks/useDialog";

export default function ProfileDropdown() {
	const profileDialog = useDialog();
	const friendsDialog = useDialog();

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<ProfileAvatar iconOnly={true} />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-80">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="hover:cursor-pointer" {...profileDialog.triggerProps}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer" {...friendsDialog.triggerProps}>
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

			<ProfileDialog dialogProps={profileDialog.dialogProps} />
			<ManageFriendsDialog dialogProps={friendsDialog.dialogProps} />
		</>
	);
}
