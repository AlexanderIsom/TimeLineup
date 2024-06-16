"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { GetLocalUserEventsType } from "@/actions/eventActions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { formatDateRange } from "@/utils/dateUtils";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

interface Props {
	title: string;
	description: string;
	events?: GetLocalUserEventsType;
}

export default function EventCard({ title, description, events }: Props) {
	const router = useRouter();
	return (
		<Card className="mx-auto flex w-full flex-1 flex-col justify-between shadow-md md:max-w-[33%]">
			<div>
				<CardHeader className="rounded-t-lg">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-1 overflow-hidden p-4">
					{events?.map((event, index) => {
						return (
							<div key={event.id} className="flex flex-col gap-1">
								{index > 0 && <Separator />}
								<button
									className="group flex rounded-md hover:bg-gray-100 md:p-2"
									onClick={() => {
										router.push(`/events/${event.id}`);
									}}
									disabled={event.end < new Date()}
								>
									<div className="flex h-12 w-full items-center gap-2">
										<div className="flex w-fit items-center gap-2">
											<Avatar>
												<AvatarImage src={event.host.avatarUrl!} />
												<AvatarFallback className="bg-gray-200">
													<User />
												</AvatarFallback>
											</Avatar>
											<div className="hidden truncate md:flex">{event.host.username}</div>
										</div>
										<Separator orientation="vertical" className="group-hover:bg-gray-300" />
										<div className="flex max-w-64 flex-grow flex-col items-start">
											<span className="truncate">{event.title}</span>
											<span className="text-start text-sm">
												{formatDateRange(event.start, event.end)}
											</span>
										</div>
										<Separator orientation="vertical" className="group-hover:bg-gray-300" />
										<span className="flex-grow">
											{event.end < new Date() ? "Ended" : event.status}
										</span>
									</div>
								</button>
							</div>
						);
					})}
				</CardContent>
			</div>
		</Card>
	);
}
