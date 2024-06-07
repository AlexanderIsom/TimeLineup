import { addDays, areIntervalsOverlapping } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GetLocalUserEvents } from "@/actions/eventActions";
import EventCard from "@/components/events/EventCard";
import { Card } from "@/components/ui/card";
import CreateEventDialog from "@/components/events/newEventForm/createEventDialog";
import { Profile } from "@/db/schema";
import { promise } from "zod";
import { getFriends } from "@/actions/friendActions";

export default async function Events() {
	const userEvents = await GetLocalUserEvents();
	const friends = await getFriends();

	const today = new Date();
	const sevenDaysTime = addDays(today, 7);

	const pastEvents = userEvents?.filter((event) => event.end < today);
	const currentEvents = userEvents?.filter((event) => {
		return areIntervalsOverlapping({ start: today, end: sevenDaysTime }, { start: event.start, end: event.end });
	});

	const upcomingEvents = userEvents?.filter((event) => event.start > sevenDaysTime);

	return (
		<div className="h-full">
			<Card className="mx-4 mt-2 flex items-center p-4 align-middle">{/* <CreateEventDialog /> */}</Card>
			<div className="flex h-[90%] flex-col gap-4 p-4 md:flex-row">
				<EventCard title={"Next 7 days"} description="Events over the next week." events={currentEvents} />
				<EventCard title={"Upcoming"} description="Future events." events={upcomingEvents} />
				<EventCard
					title={"Last 14 days"}
					description="Past events from the last 2 weeks."
					events={pastEvents}
				/>
			</div>
		</div>
	);
}
