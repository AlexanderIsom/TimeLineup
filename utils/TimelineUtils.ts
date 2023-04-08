import { addSeconds, differenceInSeconds } from "date-fns";
import { RefObject, useEffect, useState } from "react";

export interface TimelineUtils {
	toX: (from: any) => number;
	toDate: (x: number) => Date;
	getWidth: (from: Date, to: Date) => number;

}

interface props {
	start: string;
	end: string;
	ref: RefObject<HTMLDivElement>;
}

export default function CreateTimeline({ start, end, ref }: props): TimelineUtils {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const element = ref?.current;
		if (!element)
			return

		const observer = new ResizeObserver((elements) => {
			elements.forEach(entry => {
				setWidth(entry.contentRect.width);
			});
		})

		observer.observe(element);
		return () => {
			observer.disconnect();
		}
	}, [])

	const timelineStartDate = new Date(start)
	const timelineEndDate = new Date(end)
	const duration = differenceInSeconds(timelineEndDate, timelineStartDate)

	const toX = (from: Date) => {
		const value = (differenceInSeconds(from, timelineStartDate)) / duration
		return Math.round(value * width)
	}

	const toDate = (x: number) => {
		const percentage = x / width // calculate percentage
		return addSeconds(timelineStartDate, (percentage * duration))
	}

	const getWidth = (from: Date, to: Date) => {
		const x1 = toX(from);
		const x2 = toX(to);
		return x2 - x1;
	}

	return { toX, toDate, getWidth }
}

