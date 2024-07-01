import { signOut } from "@/actions/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartHandshake, LogOut, User } from "lucide-react";

import { ProfileAvatar } from "./profileAvatar";
import DropdownDialogTrigger from "../dropdownDialogTrigger";

export default function ProfileDropdown() {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<ProfileAvatar iconOnly={true} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownDialogTrigger dialogId="profile" className="hover:cursor-pointer">
					<User className="mr-2 h-4 w-4" />
					<span>Profile</span>
				</DropdownDialogTrigger>

				<DropdownDialogTrigger dialogId="friends" className="hover:cursor-pointer">
					<HeartHandshake className="mr-2 h-4 w-4" />
					<span>Manage friends</span>
				</DropdownDialogTrigger>

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
