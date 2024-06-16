"use client";
import { Profile, Segment } from "@/db/schema";
import { useIsMobile } from "@/utils/useIsMobile";
import { differenceInMinutes, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
	eventStartTime: Date;
	minuteWidth: number;
	schedule: Segment;
	user: Profile;
}

export default function StaticTimeCard({ schedule, eventStartTime, minuteWidth, user }: Props) {
	const duration = differenceInMinutes(schedule.end, schedule.start);
	const offset = differenceInMinutes(schedule.start, eventStartTime);
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const isMobile = useIsMobile();

	return (
		<TooltipProvider>
			<Tooltip
				open={tooltipOpen}
				onOpenChange={(state: boolean) => {
					setTooltipOpen(state);
				}}
			>
				<TooltipTrigger asChild>
					<div
						style={{ width: duration * minuteWidth + "px", translate: offset * minuteWidth + "px" }}
						className="absolute flex h-14 items-center justify-center"
						onClick={() => {
							console.log("clicked");
							if (isMobile) setTooltipOpen(!tooltipOpen);
						}}
					>
						<div className="absolute flex h-14 w-full items-center justify-between overflow-hidden rounded-md bg-gray-100 shadow-md shadow-gray-200">
							<span className="items-center overflow-hidden text-ellipsis p-2 font-semibold">
								{format(schedule.start, "HH:mm")}
							</span>
							{isMobile && (
								<Avatar>
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="bg-gray-200">
										<User />
									</AvatarFallback>
								</Avatar>
							)}
							<span className="items-center overflow-hidden text-ellipsis p-2 font-semibold">
								{format(schedule.end, "HH:mm")}
							</span>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent>{user.username}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
