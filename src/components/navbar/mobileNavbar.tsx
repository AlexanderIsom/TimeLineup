import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Calendar, HeartHandshake, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import ProfileDialog from "./profile/profileDialog";
import FriendsDialog from "./profile/friendsDialog";
import { useState } from "react";

interface Props {
	signedIn: boolean;
	profileLoading: boolean;
}

export default function MobileNavbar({ signedIn, profileLoading }: Props) {
	const [open, setOpen] = useState(false);
	return <Sheet open={open} onOpenChange={(state: boolean) => {
		setOpen(state);
	}}>
		<SheetTrigger>
			<Button className="md:hidden" size="icon" variant="outline">
				<MenuIcon className="h-6 w-6" />
			</Button>
		</SheetTrigger>
		<SheetContent side={"right"} className="flex flex-col">
			{(!signedIn && !profileLoading) ?
				<div className="flex flex-col h-full justify-end items-center">
					<div className="flex flex-col w-full gap-6 p-6  items-center">
						Please login to continue
						<Separator />
						<Link className="font-medium hover:underline flex items-center" href="#">
							<LogIn className="mr-2 h-4 w-4" />
							<span>Log In</span>
						</Link>

					</div>
				</div> :
				<div className="flex flex-col h-full justify-between">
					<div className="grid gap-6 p-6 ">
						<Link href="/events" className="font-medium hover:underline">
							Notifications
						</Link>
						<Separator />
						<Link href="/events" className="font-medium hover:underline flex items-center" onClick={() => {
							setOpen(false);
						}}>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Events</span>
						</Link>
						<Separator />
						<ProfileDialog>
							<Link className="font-medium hover:underline flex items-center" href="#" >
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</ProfileDialog>
						<FriendsDialog>
							<Link className="font-medium hover:underline flex items-center" href="#">
								<HeartHandshake className="mr-2 h-4 w-4" />
								<span>Manage friends</span>
							</Link>
						</FriendsDialog>
					</div>
					<Link className="font-medium hover:underline px-6 flex items-center" href="#">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</Link>
				</div>
			}
		</SheetContent>
	</Sheet>
}