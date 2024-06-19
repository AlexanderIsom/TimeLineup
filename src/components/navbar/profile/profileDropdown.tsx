import { signOut } from "@/actions/auth";
// import { useDialog } from "@/components/hooks/useDialog";
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

import { ProfileAvatar } from "./profileAvatar";

export default function ProfileDropdown() {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<ProfileAvatar iconOnly={true} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="hover:cursor-pointer">
					<Link
						href={{ query: { dialog: "profile" } }}
						className="flex h-full w-full items-center"
						scroll={false}
						prefetch={false}
						replace={true}
					>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className="hover:cursor-pointer">
					<Link
						href={{ query: { dialog: "manageFriends" } }}
						className="flex h-full w-full items-center"
						scroll={false}
						prefetch={false}
						replace={true}
					>
						<HeartHandshake className="mr-2 h-4 w-4" />
						<span>Manage friends</span>
					</Link>
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
	);
}
