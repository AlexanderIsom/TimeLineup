'use client'
import { Profile } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LogOut, Settings2, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./ProfileButton.module.scss"

interface Props {
	profile: Profile;
}

export default function ProfileButton({ profile }: Props) {
	const supabase = createClient();
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.refresh();
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Avatar>
					<AvatarImage src={profile.avatarUrl ?? undefined} />
					<AvatarFallback>{profile.username!.substring(0, 2)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger >
			<DropdownMenuContent className="w-80">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<Link href={"/profile"}>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
				</Link>
				<Link href={"/profile"}>
					<DropdownMenuItem>
						<Settings2 className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
				</Link>

				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout} className={styles.Logout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>

			</DropdownMenuContent >
		</DropdownMenu>
	)

}