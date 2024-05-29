import { addDays, areIntervalsOverlapping } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EventServerDialog from "@/components/events/newEventForm/eventServerDialog";
import { GetLocalUserEvents } from "@/actions/eventActions";
import EventCard from "@/components/events/EventCard";
import { Card } from "@/components/ui/card";

export default async function Events() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }

  // const userEvents = await GetLocalUserEvents();

  // const today = new Date();
  // const sevenDaysTime = addDays(today, 7);

  // const pastEvents = userEvents?.filter(event => event.end < today)
  // const currentEvents = userEvents?.filter(event => {
  //   return areIntervalsOverlapping({ start: today, end: sevenDaysTime }, { start: event.start, end: event.end })
  // });

  // const upcomingEvents = userEvents?.filter(event => event.start > sevenDaysTime);

  return (
    <div className="h-full">
      <Card className="flex mx-4 mt-2 p-4 items-center align-middle">
        {/* <EventServerDialog /> */}
      </Card>
      <div className="flex flex-col md:flex-row gap-4 p-4 h-[90%]">
        {/* <EventCard title={"Next 7 days"} description="Events over the next week." events={currentEvents} />
        <EventCard title={"Upcoming"} description="Future events." events={upcomingEvents} />
        <EventCard title={"Last 14 days"} description="Past events from the last 2 weeks." events={pastEvents} /> */}
      </div>
    </div >
  );
}
