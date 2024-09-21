import RsvpFilters from "@/components/dashboard/events/rsvpFilters";
import RsvpToggle from "@/components/dashboard/events/rsvpToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRsvps } from "@/lib/supabase/queries/getRsvps";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { User } from "lucide-react";

export default async function EventPage({ params }: { params: { id: number } }) {
	const supabase = createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const { data: rsvps } = await getRsvps(supabase, params.id);
	const { data: event } = await supabase.from("event").select("*, host_profile:profile(*), rsvps:rsvp(*)").eq("id", params.id).single();
	if (!event || !user) return;
	const isHost = event.host === user.id;
	const localRsvp = event.rsvps.find((rsvp) => rsvp.user_id === user.id);
	return (
		<div className="flex grow flex-col gap-4 p-4 prose min-w-full col-start-2 col-end-3 ">
			<Card className="min-h-full p-4 flex flex-col gap-2">
				<div className="not-prose text-center flex flex-col items-center">
					<Avatar className="size-32">
						<AvatarImage src={event?.host_profile?.avatar_url ?? undefined} />
						<AvatarFallback className="bg-gray-200">
							<User />
						</AvatarFallback>
					</Avatar>
					{event?.host_profile?.username}
				</div>
				<Card >
					<CardHeader>
						<CardTitle>{event?.title}</CardTitle>
						<CardDescription>
							{format(event.date, "PPP")}<br />
							{format(event.start_time, "HH:mm")} - {format(event.end_time, "HH:mm")}
						</CardDescription>
					</CardHeader>
					<CardContent >
						{event?.description === "" ? null : <>
							<div className="flex gap-2 items-center ">
								<div className="w-fit text-gray-400 ">
									description
								</div>
								<div className="w-full">
									<Separator className="w-full" />
								</div>
							</div>
							{event?.description}
						</>
						}
					</CardContent>
				</Card>


				{!isHost && <RsvpToggle rsvpId={localRsvp!.id} defaultStatus={localRsvp!.status} />}

				<RsvpFilters rsvps={rsvps} />
			</Card >
		</div>
	)
}