import { createClient } from "@/lib/supabase/server";
import { Bell, Calendar, Copy, ListPlus, LogIn, LogOut, MenuIcon, SquareUserRound, User, UserSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Inbox from "./inbox";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import HideOnRoute from "../hideOnRoute";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import QueryButton from "../queryButton";
import CopyProfileLink from "../dashboard/copyProfileLink";
import { getCurrentProfile } from "@/lib/session";
import NotificationBadge from "./notiticationBadge";

export default async function Navbar() {
	const { profile, user } = await getCurrentProfile();
	const signedIn = user !== null;

	return (
		<nav className="row-start-1 row-end-2 h-16 flex w-full items-center justify-between border-b px-8 bg-white">
			<div className="flex w-full items-center justify-between gap-12">
				<Link className="flex h-fit items-center gap-1 text-2xl font-bold" href={"/"}>
					<Image src="/logo.svg" alt="logo" width={30} height={30} />
					<span className="no-underline">
						Time<span className="underline">Lineup.</span>
					</span>
				</Link>

				<nav
					className={`w-full ${signedIn ? "justify-end" : "justify-end"}  items-center gap-8 pr-4 hidden md:flex`}
				>
					{signedIn ? (
						<>
							<HideOnRoute route="/dashboard">
								<Button asChild size={"sm"} className="bg-primary">
									<Link href="/dashboard">dashboard</Link>
								</Button>
							</HideOnRoute>
							<Inbox />
						</>
					) : (
						<Button asChild>
							<Link href="/auth/sign-in">Sign in</Link>
						</Button>
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
									<div className="flex h-fit items-center gap-1 text-2xl font-bold">
										<Image src="/logo.svg" alt="logo" width={30} height={30} />
										<span className="no-underline">
											Time<span className="underline">Lineup.</span>
										</span>
									</div>

									<QueryButton query="dialog" value="new" className="flex gap-2" variant={"secondary"} >
										<ListPlus className="size-5" />
										Create event
									</QueryButton>

									<Separator />

									<SheetClose asChild>
										<Link
											href="/dashboard/notifications"
											className="flex items-center font-medium hover:cursor-pointer group gap-2"
										>
											<Bell className="size-5" />
											<span className="group-hover:underline">Notifications </span>
											<NotificationBadge />
										</Link>
									</SheetClose>
									<SheetClose asChild>
										<Link
											href="/dashboard/events"
											className="flex items-center font-medium hover:cursor-pointer hover:underline gap-2"
										>
											<Calendar className="size-5" />
											<span>Events</span>
										</Link>
									</SheetClose>
									<SheetClose asChild>
										<Link
											href="/dashboard/friends"
											className="flex items-center font-medium hover:cursor-pointer hover:underline gap-2"
										>
											<UserSearch className="size-5" />
											<span>Friends</span>
										</Link>
									</SheetClose>
								</div>

								<div className="flex flex-col gap-4 not-prose">
									<SheetClose asChild>
										<Link href="profile" className="no-underline flex gap-2">
											< User className="size-5" />
											edit profile
										</Link>
									</SheetClose>
									<SheetClose asChild>
										<Link href={`/me/${profile?.id}`} className="no-underline flex gap-2 ">
											< SquareUserRound className="size-5" />
											go to public profile page
										</Link>
									</SheetClose>

									<CopyProfileLink path={`${process.env.BASE_URL}/me/${profile!.id}`} className="p-0 h-fit text-base font-normal ">
										<Copy className="size-5" />
										copy profile page link
									</CopyProfileLink>

									<Separator className="mt-2" />
									<div className="flex flex-col gap-2 mt-2">
										<div className="flex w-full items-center justify-center gap-2">
											<Avatar className="size-8 not-prose">
												<AvatarImage src={profile!.avatar_url ?? undefined} />
												<AvatarFallback className="bg-gray-200">
													<User />
												</AvatarFallback>
											</Avatar>
											<p className="not-prose text-sm text-gray-900">{profile!.username}</p>
										</div>
										<form action={"/auth/signout"} method="POST">
											<Button variant={"ghost"} className="flex gap-2 justify-center w-full text-gray-900">
												<LogOut className="size-5" />
												sign out
											</Button>
										</form>
									</div>
								</div>
							</div>
						) : (
							<div className="flex h-full flex-col items-center justify-end">
								<div className="flex w-full flex-col items-center gap-6 p-6">
									Please sign in to continue
									<Separator />
									<Link
										href={"/auth/sign-in"}
										className="flex items-center font-medium hover:underline"
									>
										<LogIn className="mr-2 size-4" />
										Sign In
									</Link>
								</div>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</nav >
	);
}
