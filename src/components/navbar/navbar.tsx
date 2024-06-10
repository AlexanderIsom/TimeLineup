import { createClient } from "@/utils/supabase/server";
import { Calendar, HeartHandshake, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginDialog from "../login/loginDialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Inbox from "./inbox/inbox";
import { ManageFriendsDrawer } from "./profile/manageFriends/manageFriendsDialog";
import { ProfileDrawer } from "./profile/profileDialog";
import ProfileDropdown from "./profile/profileDropdown";

export default async function Navbar() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const signedIn = user !== null;

	return (
		<nav className="fixed top-0 z-50 flex h-24 w-full items-center justify-between bg-white/90 px-8 backdrop-blur-md">
			<div className="flex w-full items-center justify-between gap-12">
				<Link className="flex h-fit items-center gap-1 text-2xl font-bold" href={"/"}>
					<Image src="/logo.svg" alt="logo" width={30} height={30} />
					<span className="no-underline">
						Time<span className="underline">Lineup.</span>
					</span>
				</Link>

				<nav className={`w-full ${signedIn ? "justify-between" : "justify-end"} hidden pr-4 md:flex`}>
					{signedIn ? (
						<>
							<Link href="/events">
								<Button variant="ghost">
									<div className="text-xl font-medium">Events</div>
								</Button>
							</Link>

							<div className="flex items-center gap-8">
								<Inbox />
								<ProfileDropdown />
							</div>
						</>
					) : (
						<LoginDialog>
							<Button>Sign In</Button>
						</LoginDialog>
					)}
				</nav>

				<Sheet>
					<SheetTrigger asChild className="block md:hidden">
						<Button size="icon" variant="outline">
							<MenuIcon className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side={"right"} className="flex flex-col">
						{signedIn ? (
							<div className="flex h-full flex-col justify-between">
								<div className="grid gap-6 px-2 py-6">
									<Inbox />
									<SheetClose asChild>
										<Link
											href="/events"
											className="flex items-center font-medium hover:cursor-pointer hover:underline"
										>
											<Calendar className="mr-2 h-4 w-4" />
											<span>Events</span>
										</Link>
									</SheetClose>

									<ProfileDrawer>
										<div className="flex items-center font-medium hover:cursor-pointer hover:underline">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</div>
									</ProfileDrawer>
									<ManageFriendsDrawer>
										<div className="flex items-center font-medium hover:cursor-pointer hover:underline">
											<HeartHandshake className="mr-2 h-4 w-4" />
											<span>Manage friends</span>
										</div>
									</ManageFriendsDrawer>
								</div>
								<SheetClose asChild>
									<form action={"/auth/signout"} method="POST">
										<button
											type="submit"
											className="flex items-center px-2 font-medium hover:cursor-pointer hover:underline"
										>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sign out</span>
										</button>
									</form>
								</SheetClose>
							</div>
						) : (
							<div className="flex h-full flex-col items-center justify-end">
								<div className="flex w-full flex-col items-center gap-6 p-6">
									Please sign in to continue
									<Separator />
									<LoginDialog>
										<div className="flex items-center font-medium hover:underline">
											<LogIn className="mr-2 h-4 w-4" />
											<span>Sign In</span>
										</div>
									</LoginDialog>
								</div>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
