"use client";
import { signOut } from "@/actions/auth";
import { useDialog } from "@/components/hooks/useDialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { HeartHandshake, LogOut, User } from "lucide-react";
import ManageFriendsDialog from "./manageFriends/manageFriendsDialog";
import { ProfileAvatar } from "./profileAvatar";
import { ProfileDialog } from "./profileDialog";

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
					<DropdownMenuItem className="hover:cursor-pointer">
						<Link href="?dialog=profile" className="flex h-full w-full items-center" shallow={true}>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem className="hover:cursor-pointer" {...friendsDialog.triggerProps}>
						<HeartHandshake className="mr-2 h-4 w-4" />
						<span>Manage friends</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<form action={signOut}>
						<DropdownMenuItem className="w-full hover:cursor-pointer" asChild>
							<button type="submit">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</button>
						</DropdownMenuItem>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* <ProfileDialog dialogProps={profileDialog.dialogProps} /> */}
			<ManageFriendsDialog dialogProps={friendsDialog.dialogProps} />
		</>
	);
}
