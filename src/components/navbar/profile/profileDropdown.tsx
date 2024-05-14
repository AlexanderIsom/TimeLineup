'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeartHandshake, LogOut, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProfileForm from "./profileForm";
import { useState } from "react";
import ManageFriends from "./manageFriends";
import { useFriends, useProfile } from "@/swr/swrFunctions";
import ProfileDialog from "./profileDialog";
import FriendsDialog from "./friendsDialog";


export default function ProfileDropdown() {
	const { profile } = useProfile();
	const { friends } = useFriends();
	const supabase = createClient();
	const router = useRouter();
	const [dialogOption, setDialogOption] = useState<string>();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.refresh();
	};

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild >
					<Avatar>
						<AvatarImage src={profile?.avatarUrl ?? undefined} />
						<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger >
				<DropdownMenuContent className="w-80">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => {
						setDialogOption("profile")
					}}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => {
						setDialogOption("friends")
					}}>
						<HeartHandshake className="mr-2 h-4 w-4" />
						<span>Manage friends</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>

				</DropdownMenuContent >
			</DropdownMenu>

			<ProfileDialog open={dialogOption === "profile"} onClose={() => {
				setDialogOption(undefined);
			}} />

			<FriendsDialog open={dialogOption === "friends"} onClose={() => {
				setDialogOption(undefined);
			}} />
		</>
	)
}