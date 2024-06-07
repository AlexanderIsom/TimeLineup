import { Button } from "../ui/button";
import LoginDialog from "../login/loginDialog";
import { createClient } from "@/utils/supabase/server";
import { Calendar, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { ProfileDialog } from "./profile/profileDialog";
import { Separator } from "../ui/separator";
import ProfileDropdown from "./profile/profileDropdown";
import { Suspense } from "react";
import { ProfileAvatarFallback } from "./profile/profileAvatar";
import Inbox from "./inbox/inbox";

export default async function Navbar() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const signedIn = user !== null;

	return (
		<header className="sticky top-0 z-50 flex h-24 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-8 shadow-md shadow-gray-100 backdrop-blur-md">
			<div className="flex w-full items-center justify-between gap-12">
				<Link className="h-fit text-2xl font-bold" href={"/"}>
					<span className="no-underline">Time</span>
					<span className="underline">Lineup.</span>
				</Link>

				<nav className={`w-full ${signedIn ? "justify-between" : "justify-end"} hidden md:flex`}>
					{signedIn ? (
						<>
							<Link href="/events">
								<Button variant="ghost">
									<div className="text-xl font-medium">Events</div>
								</Button>
							</Link>

							<div className="flex items-center gap-8">
								<Inbox />
								<Suspense fallback={<ProfileAvatarFallback />}>
									<ProfileDropdown />
								</Suspense>
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

									<ProfileDialog>
										<div className="flex items-center font-medium hover:cursor-pointer hover:underline">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</div>
									</ProfileDialog>
									{/* <ManageFriendsDialog>
										<div className="flex items-center font-medium hover:cursor-pointer hover:underline">
											<HeartHandshake className="mr-2 h-4 w-4" />
											<span>Manage friends</span>
										</div>
									</ManageFriendsDialog> */}
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
		</header>
	);
}
