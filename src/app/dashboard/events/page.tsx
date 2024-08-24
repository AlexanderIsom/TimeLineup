import { addDays, areIntervalsOverlapping } from "date-fns";
import { GetLocalUserEvents } from "@/actions/eventActions";
import EventCard from "@/components/events/EventCard";
import { getFriends } from "@/actions/friendActions";
import { Profile } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";


export default async function Events() {
	const userEvents = await GetLocalUserEvents();
	const friends: Array<Profile> | undefined = await getFriends();

	const today = new Date();
	const sevenDaysTime = addDays(today, 7);

	const pastEvents = userEvents?.filter((event) => event.end < today);
	const currentEvents = userEvents?.filter((event) => {
		return areIntervalsOverlapping({ start: today, end: sevenDaysTime }, { start: event.start, end: event.end });
	});

	const upcomingEvents = userEvents?.filter((event) => event.start > sevenDaysTime);

	return (
		<div className="flex grow flex-col gap-4 p-4 prose min-w-full">
			<div>
				<h3 className="m-0">
					Events
				</h3>
				<p className="m-0">
					See your upcoming and past events
				</p>
			</div>
			<div className="flex gap-2">
				<Button variant={"secondary"}>
					Upcoming
				</Button>
				<Button variant={"ghost"}>
					Uncomfirmed
				</Button>
				<Button variant={"ghost"}>
					Past
				</Button>
				<Button variant={"ghost"}>
					Declined
				</Button>
			</div>


			<Card className="w-full min-h-96">
				<div className="size-full flex flex-col gap-2 justify-center items-center text-center">
					<div className="bg-gray-200 rounded-full p-4">
						<Calendar className="size-8" />
					</div>
					<div className="flex flex-col gap-1 text-center items-center justify-center">
						<h3 className="m-0">No upcoming events</h3>
						<p className="m-0 text-wrap w-3/4">you have no upcoming events, As soon as you make an event or accept an invite to one it will show up here</p>
					</div>

				</div>
			</Card>
		</div>
	);
}
