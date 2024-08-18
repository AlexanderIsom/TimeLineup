import { Button } from "../ui/button";
import { Cable, CalendarCheck, ListPlus, MessageCircleQuestion, UserSearch } from "lucide-react";
import { Calendar } from "../ui/calendar";

export default function DashboardNav() {
	return (
		<div className="prose flex flex-col px-2 justify-between pb-8 gap-2 border-r">
			<div className="flex flex-col justify-center">
				<Button className="my-8 flex gap-2" variant={"secondary"} >
					<ListPlus />
					Create event
				</Button>

				<div className="flex flex-col gap-2 justify-start w-full ">
					<Button variant={"ghost"} className="flex gap-2 justify-start">
						<MessageCircleQuestion />
						Avalability
					</Button>
					<Button variant={"ghost"} className="flex gap-2 justify-start">
						<CalendarCheck />
						Events
					</Button>
					<Button variant={"ghost"} className="flex gap-2 justify-start">
						<UserSearch />
						Friends
					</Button>
					<Button variant={"ghost"} className="flex gap-2 justify-start">
						<Cable />
						Apps
					</Button>
				</div>
			</div>

			<Calendar mode="single" className="rounded-md border not-prose" />

		</div>
	)
}