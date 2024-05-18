"use client"
import { Profile, Segment } from "@/db/schema";
import { useIsMobile } from "@/utils/useIsMobile";
import { differenceInMinutes, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

interface Props {
	eventStartTime: Date;
	minuteWidth: number;
	schedule: Segment;
	user: Profile
}

export default function StaticTimeCard({ schedule, eventStartTime, minuteWidth, user }: Props) {
	const duration = differenceInMinutes(schedule.end, schedule.start)
	const offset = differenceInMinutes(schedule.start, eventStartTime)

	const isMobile = useIsMobile();

	return (
		<div
			style={{ width: duration * minuteWidth + "px", translate: offset * minuteWidth + "px" }}
			className="absolute flex justify-center items-center h-14"
		>
			<div className="flex absolute h-14 bg-gray-100 rounded-md w-full items-center justify-between overflow-hidden shadow-md shadow-gray-200">
				<span className="p-2 items-center text-ellipsis overflow-hidden font-semibold">{format(schedule.start, "HH:mm")}</span>
				{isMobile && <Avatar>
					<AvatarImage src={user.avatarUrl ?? undefined} />
					<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
				</Avatar>}
				<span className="p-2 items-center text-ellipsis overflow-hidden font-semibold">{format(schedule.end, "HH:mm")}</span>
			</div>
		</div>
	);
}
