import { GetEventsAsAttendee } from "@/actions/eventActions";
import RsvpToggle from "@/components/dashboard/events/rsvpToggle";
import { ProfileAvatar } from "@/components/profileAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export default async function Events() {
	const userRsvpEvents = await GetEventsAsAttendee();

	let content;
	if (!userRsvpEvents || userRsvpEvents.length <= 0) {
		content = <div className="size-full flex flex-col gap-2 justify-center items-center text-center">
			<div className="bg-gray-200 rounded-full p-4">
				<Calendar className="size-8" />
			</div>
			<div className="flex flex-col gap-1 text-center items-center justify-center">
				<h3 className="m-0">No upcoming events</h3>
				<p className="m-0 text-wrap w-3/4">you have no upcoming events, As soon as you make an event or accept an invite to one it will show up here</p>
			</div>
		</div>
	} else {
		content = (
			<div className="flex flex-col gap-2">
				{userRsvpEvents.map((rsvp) => {
					if (!rsvp.event) return;

					return <div key={rsvp.id} className="flex gap-2">
						<div className="not-prose flex gap-2 items-center justify-center">
							<ProfileAvatar className="not-prose size-16" profile={rsvp.event.host_profile!} iconOnly={true} />
							<div>
								<p>{rsvp.event?.title}</p>
								<p className="text-sm">{rsvp.event?.description}</p>
							</div>
							<div className="flex flex-col items-center">
								<p>{format(rsvp.event.date, "PPP")}</p>
								<p>{format(rsvp.event.start_time, "HH:mm")} - {format(rsvp.event.end_time, "HH:mm")}</p>
							</div>
							<div>
								<div className="flex gap-2">
									<div className="flex items-center gap-2">
										<RsvpToggle rsvpId={rsvp.id} defaultStatus={rsvp.status} />
									</div>
								</div>
							</div>
						</div>
					</div>
				})}
			</div>
		)
	}

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


			<Card className="w-full min-h-96 p-4">
				{content}
			</Card>
		</div>
	);
}
