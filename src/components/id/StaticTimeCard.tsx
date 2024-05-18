import { Segment } from "@/db/schema";
import { differenceInMinutes, format } from "date-fns";

interface Props {
	eventStartTime: Date;
	minuteWidth: number;
	schedule: Segment;
}

export default function StaticTimeCard({ schedule, eventStartTime, minuteWidth }: Props) {
	const duration = differenceInMinutes(schedule.end, schedule.start)
	const offset = differenceInMinutes(schedule.start, eventStartTime)

	return (
		<div
			style={{ width: duration * minuteWidth + "px", translate: offset * minuteWidth + "px" }}
			className="absolute flex justify-center items-center h-14"
		>
			<div className="flex absolute h-14 bg-gray-100 rounded-md w-full items-center justify-between overflow-hidden shadow-md shadow-gray-200">
				<span className="p-2 items-center text-ellipsis overflow-hidden font-semibold">{format(schedule.start, "HH:mm")}</span>
				<span className="p-2 items-center text-ellipsis overflow-hidden font-semibold">{format(schedule.end, "HH:mm")}</span>
			</div>
		</div>
	);
}
