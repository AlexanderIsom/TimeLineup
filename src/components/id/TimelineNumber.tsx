import {
	differenceInMinutes,
	eachDayOfInterval,
	eachHourOfInterval,
	eachMinuteOfInterval,
	format,
	formatDate,
	roundToNearestHours,
} from "date-fns";
import { ForwardedRef } from "react";

interface Props {
	start: Date;
	end: Date;
	minuteWidth: number;
	forwardedRef: ForwardedRef<HTMLDivElement>;
}

export default function TimelineNumbers({ start, end, forwardedRef, minuteWidth }: Props) {
	const daysInRange = eachDayOfInterval({ start: start, end: end });
	const ceilStart = roundToNearestHours(start, { roundingMethod: "ceil" });
	const offset = differenceInMinutes(ceilStart, start);
	return (
		<div
			className="col-start-2 col-end-3 row-start-1 row-end-2 flex items-end overflow-hidden border-l border-gray-300"
			ref={forwardedRef}
		>
			{daysInRange.map((date, index) => {
				return (
					<DayHeaderAndHours
						key={formatDate(date, "yy-mm-dd")}
						date={date}
						start={ceilStart}
						end={end}
						minuteWidth={minuteWidth}
						dayIndex={index}
						offset={offset <= 60 ? 0 : offset}
					/>
				);
			})}
		</div>
	);
}

interface DayHeaderAndHoursProps {
	date: Date;
	start: Date;
	end: Date;
	minuteWidth: number;
	dayIndex: number;
	offset: number;
}

function DayHeaderAndHours({ date, start, end, minuteWidth, offset, dayIndex }: DayHeaderAndHoursProps) {
	let startTime = new Date(date.setHours(0, 0, 0, 0));
	let endTime = new Date(date.setHours(23, 59, 59, 999));
	if (startTime < start) {
		startTime = start;
	}
	if (endTime > end) {
		endTime = end;
	}
	let numberList = eachHourOfInterval({ start: startTime, end: endTime });
	const useMinutes = differenceInMinutes(endTime, startTime) <= 60;
	if (useMinutes) {
		numberList = eachMinuteOfInterval({ start: startTime, end: endTime }, { step: 5 });
	}
	return (
		<div className="h-full min-w-max border-gray-300">
			<div className="flex h-1/2 items-end">
				<span className="sticky left-0 right-0 px-8">{format(date, "LLL do")}</span>
			</div>

			<div className={"h-1/2 w-full self-end border-t border-gray-300"}>
				{numberList.map((date: Date, index: number) => {
					return (
						<div
							className={`inline-flex h-full flex-1 -translate-x-1/2 items-center justify-center border-gray-300`}
							style={{
								width: `${minuteWidth * (useMinutes ? 5 : 60)}px`,
								marginLeft: `${dayIndex === 0 && index === 0 ? offset * minuteWidth + "px" : "0"}`,
							}}
							key={index}
						>
							<div className={"justify-center text-center text-base font-normal"}>
								{useMinutes ? `${date.getHours()}:${date.getMinutes()}` : `${date.getHours()}:00`}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
