
import { getCurrentProfile } from "@/lib/session";
import { CalendarCheck, ListPlus, LogOut, SquareUserRound, User, UserSearch } from "lucide-react";
import Link from "next/link";
import QueryButton from "../queryButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import CopyProfileLink from "./copyProfileLink";

export default async function DashboardNav() {
	const { profile } = await getCurrentProfile();
	return (
		<nav className="prose size-full p-2 border-r flex flex-col justify-between min-w-64">
			<div className="flex flex-col justify-start gap-2">
				<QueryButton query="dialog" value="new" className="flex gap-2" variant={"secondary"} >
					<ListPlus className="size-5" />
					Create event
				</QueryButton>

				<Button variant={'ghost'} className="flex gap-2 justify-start" asChild>
					<Link href="/dashboard/events" className="no-underline underline-offset-2">
						<CalendarCheck className="size-5" />
						Events
					</Link>
				</Button>
				<Button variant={'ghost'} className="flex gap-2 justify-start" asChild>
					<Link href="/dashboard/friends" className="no-underline underline-offset-2">
						<UserSearch className="size-5" />
						Friends
					</Link>
				</Button>
			</div>

			<div className="flex flex-col justify-center">
				<Button variant={"ghost"} className="flex gap-2 justify-start" asChild>
					<Link href="profile" className="no-underline">
						< User className="size-5" />
						edit profile
					</Link>
				</Button>
				<Button variant={"ghost"} className="flex gap-2 justify-start" asChild>
					<Link href={`/me/${profile?.id}`} className="no-underline">
						< SquareUserRound className="size-5" />
						go to public profile page
					</Link>
				</Button>
				<CopyProfileLink path={`${process.env.BASE_URL}/me/${profile!.id}`} />
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
		</nav >
	)
}