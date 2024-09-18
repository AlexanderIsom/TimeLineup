import { createClient } from "@/lib/supabase/server";
import { Calendar, LogIn, LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Inbox from "./navbar/inbox/inbox";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import HideOnRoute from "./hideOnRoute";

export default async function Navbar() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
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
					className={`w-full ${signedIn ? "justify-end" : "justify-end"} hidden items-center gap-8 pr-4 md:flex`}
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
		</nav>
	);
}
