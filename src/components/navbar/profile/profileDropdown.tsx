'use client'
import { Profile } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeartHandshake, LogOut, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProfileForm from "./profileForm";
import { useState } from "react";
import FriendList from "./friendList";
import { FriendStatusAndProfile } from "@/actions/friendActions";

interface Props {
	profile: Profile;
	friends: FriendStatusAndProfile
}

export default function ProfileDropdown({ profile, friends }: Props) {
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
						<AvatarImage src={profile.avatarUrl ?? undefined} />
						<AvatarFallback>{profile.username!.substring(0, 2)}</AvatarFallback>
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
						<span>Add friends</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>

				</DropdownMenuContent >
			</DropdownMenu>

			<Dialog open={dialogOption === "profile"} onOpenChange={(state) => {
				if (!state) {
					setDialogOption(undefined);
				}
			}}>
				<DialogContent>
					<DialogHeader className='flex flex-col items-center space-y-2'>
						<div className="flex items-center space-x-2">
							<Avatar >
								<AvatarImage src={profile!.avatarUrl ?? undefined} />
								<AvatarFallback>{profile!.username!.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<span>
								{profile!.username!}
							</span>
						</div>
						<DialogDescription>
							Change your profile picture and username here.
						</DialogDescription>
					</DialogHeader>
					<ProfileForm />
				</DialogContent>
			</Dialog>

			<Dialog open={dialogOption === "friends"} onOpenChange={(state) => {
				if (!state) {
					setDialogOption(undefined);
				}
			}}>
				<DialogContent>
					<DialogHeader >
						<DialogTitle>Friends</DialogTitle>
					</DialogHeader>
					<FriendList friends={friends} />
				</DialogContent>
			</Dialog>
		</>
	)
}