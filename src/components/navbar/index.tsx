import { getCurrentProfile } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import MobileDashboardNav from "../dashboard/mobileDashboardNav";
import HideOnRoute from "../hideOnRoute";
import ShowOnRoute from "../showOnRoute";
import { Button } from "../ui/button";
import Inbox from "./inbox";

export default async function Navbar() {
	const { profile, user } = await getCurrentProfile();
	const signedIn = user;

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
					className="w-full justify-end  items-center gap-8 pr-4 flex"
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
				<ShowOnRoute route="/dashboard">
					<MobileDashboardNav />
				</ShowOnRoute>
			</div>
		</nav >
	);
}
