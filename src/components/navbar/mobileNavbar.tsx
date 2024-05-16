import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Calendar, HeartHandshake, InboxIcon, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import ProfileDialog from "./profile/profileDialog";
import FriendsDialog from "./profile/friendsDialog";
import { useState } from "react";
import LoginDialog from "../login/loginDialog";
import InboxDialog from "./inbox/inboxDialog";

interface Props {
	signedIn: boolean;
	profileLoading: boolean;
}

export default function MobileNavbar({ signedIn, profileLoading }: Props) {
	const [open, setOpen] = useState(false);
	return <Sheet open={open} onOpenChange={(state: boolean) => {
		setOpen(state);
	}}>
		<SheetTrigger asChild>
			<Button size="icon" variant="outline">
				<MenuIcon className="h-6 w-6" />
			</Button>
		</SheetTrigger>
		<SheetContent side={"right"} className="flex flex-col">
			{(!signedIn || profileLoading) ?
				<div className="flex flex-col h-full justify-end items-center">
					<div className="flex flex-col w-full gap-6 p-6  items-center">
						Please login to continue
						<Separator />
						<LoginDialog>
							<div className="font-medium hover:underline flex items-center" >
								<LogIn className="mr-2 h-4 w-4" />
								<span> Login</span>
							</div>
						</LoginDialog>
					</div>
				</div> :
				<div className="flex flex-col h-full justify-between">
					<div className="grid gap-6 px-2 py-6 ">
						<InboxDialog>
							<div className="font-medium hover:underline hover:cursor-pointer flex items-center">
								<InboxIcon className="mr-2 h-4 w-4" />
								<span>Inbox</span>
								{/* <Badge className="mx-2">3</Badge>  */}
							</div>
						</InboxDialog>

						<Link href="/events" className="font-medium hover:underline hover:cursor-pointer flex items-center" onClick={() => {
							setOpen(false);
						}}>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Events</span>
						</Link>

						<ProfileDialog>
							<div className="font-medium hover:underline hover:cursor-pointer flex items-center" >
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</div>
						</ProfileDialog>
						<FriendsDialog>
							<div className="font-medium hover:underline hover:cursor-pointer flex items-center" >
								<HeartHandshake className="mr-2 h-4 w-4" />
								<span>Manage friends</span>
							</div>
						</FriendsDialog>
					</div>
					<div className="font-medium hover:underline px-2 flex hover:cursor-pointer items-center">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</div>
				</div>
			}
		</SheetContent>
	</Sheet >
}