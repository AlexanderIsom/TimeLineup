"use client"
import { CalendarCheck, Copy, ListPlus, MessageCircleQuestion, SquareUserRound, UserSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import QueryButton from "../queryButton";

export default function DashboardNav() {
	const pathname = usePathname();

	return (
		<nav className="prose size-full p-2 border-r flex flex-col justify-between">
			<div className="flex flex-col justify-start gap-2">
				<QueryButton query="new" className="flex gap-2" variant={"secondary"} >
					<ListPlus className="size-5" />
					Create event
				</QueryButton>

				<Button variant={'ghost'} className="flex gap-2 justify-start" asChild>
					<Link href="events" className={`${pathname === "/dashboard/events" ? 'underline' : "no-underline"} underline-offset-2`}>
						<CalendarCheck className="size-5" />
						Events
					</Link>
				</Button>
				<Button variant={'ghost'} className={`flex gap-2 justify-start ${pathname === "/dashboard/availability" ? 'active' : ""}`} asChild>
					<Link href="availability" className={`${pathname === "/dashboard/availability" ? 'underline' : "no-underline"} underline-offset-2`}>
						<MessageCircleQuestion className="size-5" />
						Availability
					</Link>
				</Button>
				<Button variant={'ghost'} className="flex gap-2 justify-start" asChild>
					<Link href="friends" className={`${pathname === "/dashboard/friends" ? 'underline' : "no-underline"} underline-offset-2`}>
						<UserSearch className="size-5" />
						Friends
					</Link>
				</Button>
			</div >

			<div className="flex flex-col justify-center">
				<Button variant={"ghost"} className="flex gap-2 justify-start" asChild>
					<Link href="/me/testUser" className="no-underline">
						< SquareUserRound className="size-5" />
						go to public profile page
					</Link>
				</Button>
				<Button variant={"ghost"} className="flex gap-2 justify-start" asChild>
					<Link href="availability" className="no-underline">
						<Copy className="size-5" />
						copy profile page link
					</Link>
				</Button>
			</div>
		</nav >
	)
}