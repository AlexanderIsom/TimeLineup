import { addDays, areIntervalsOverlapping } from "date-fns";
import { GetLocalUserEvents } from "@/actions/eventActions";
import EventCard from "@/components/events/EventCard";
import { Card } from "@/components/ui/card";
import { getFriends } from "@/actions/friendActions";
import CreateEventDialog from "@/components/events/newEventForm/createEventDialog";
import { Profile } from "@/db/schema";
import EventCardSkeleton from "@/components/events/EventCardSkeleton";
import { Button } from "@/components/ui/button";

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
		<div className="flex flex-grow flex-col">
			<Card className="mx-4 mt-2 flex items-center p-4 align-middle">
				<CreateEventDialog friendsList={friends}>
					<Button>Create event</Button>
				</CreateEventDialog>
			</Card>
			<div className="flex flex-grow flex-col gap-4 p-4 md:flex-row">
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
