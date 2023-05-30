import { addHours, addSeconds, closestTo, differenceInSeconds, eachHourOfInterval, endOfHour } from "date-fns";
import { RefObject, useEffect, useState } from "react";

export interface TimelineUtils {
	toX: (from: any) => number;
	toDate: (x: number) => Date;
	getWidth: () => number;
	hoursCount: number;
}

interface props {
	start: Date;
	end: Date;
	ref: RefObject<HTMLDivElement>;
}

export default function CreateTimeline({ start, end, ref }: props): TimelineUtils {
	const startTime = new Date(start);
	startTime.setMinutes(0, 0, 0);
	let endTime = new Date(end);
	if (endTime.getMinutes() > 0 || endTime.getSeconds() > 0 || endTime.getMilliseconds() > 0) {
		endTime = addHours(endTime, 1);
		endTime.setMinutes(0, 0, 0);
	}
	console.log(startTime)
	console.log(endTime)
	const hoursCount: number = eachHourOfInterval({ start: startTime, end: endTime }).length;

	const [width, setWidth] = useState(0);

	useEffect(() => {
		const element = ref?.current;
		if (!element)
			return

		const observer = new ResizeObserver(([element]) => {
			setWidth(element.contentRect.width);
		})

		observer.observe(element);
		return () => {
			observer.disconnect();
		}
	}, [ref])
	const duration = differenceInSeconds(endTime, startTime)

	const toX = (from: Date) => {
		const value = (differenceInSeconds(from, startTime)) / duration
		return Math.round(value * width)
	}

	const toDate = (x: number) => {
		const percentage = x / width // calculate percentage
		return addSeconds(startTime, (percentage * duration))
	}

	const getWidth = (): number => {
		return width;
	}

	return { toX, toDate, getWidth, hoursCount }
}

