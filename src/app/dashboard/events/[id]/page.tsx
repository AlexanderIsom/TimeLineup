import RsvpToggle from "@/components/dashboard/events/rsvpToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { User } from "lucide-react";

export default async function EventPage({ params }: { params: { id: number } }) {
	const supabase = createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const { data: rsvps } = await supabase.from("rsvp").select("*, user_profile:profile(*)").eq("event_id", params.id);
	const { data: event } = await supabase.from("event").select("*, host_profile:profile(*), rsvps:rsvp(*)").eq("id", params.id).single();
	if (!event || !user) return;
	const isHost = event.host === user.id;
	const localRsvp = event.rsvps.find((rsvp) => rsvp.user_id === user.id);
	return (
		<div className="flex grow flex-col gap-4 p-4 prose min-w-full col-start-2 col-end-3 ">
			<Card className="min-h-full p-4 flex flex-col">
				<div className="not-prose text-center flex flex-col items-center">
					<Avatar className="size-32">
						<AvatarImage src={event?.host_profile?.avatar_url ?? undefined} />
						<AvatarFallback className="bg-gray-200">
							<User />
						</AvatarFallback>
					</Avatar>
					{event?.host_profile?.username}
				</div>
				<div>{event?.title}</div>
				<div>{event?.description}</div>
				<div className="not-prose">
					<p>{format(event.date, "PPP")}</p>
					<p>{format(event.start_time, "HH:mm")} - {format(event.end_time, "HH:mm")}</p>
				</div>
				{!isHost && <RsvpToggle rsvpId={localRsvp!.id} defaultStatus={localRsvp!.status} />}
				<div>
					{rsvps?.map((rsvp) => {
						return <div key={rsvp.id} className="flex gap-2 items-center">
							<Avatar className="not-prose size-14">
								<AvatarImage src={rsvp.user_profile?.avatar_url ?? undefined} />
								<AvatarFallback className="bg-gray-200">
									<User />
								</AvatarFallback>
							</Avatar>
							{rsvp.user_profile?.username} - {rsvp.status}
						</div>
					})}
				</div>
			</Card >
		</div>
	)
}