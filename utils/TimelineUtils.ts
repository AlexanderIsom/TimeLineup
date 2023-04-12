import { addSeconds, differenceInSeconds } from "date-fns";
import { RefObject, useEffect, useState } from "react";

export interface TimelineUtils {
	toX: (from: any) => number;
	toDate: (x: number) => Date;
	getWidth: () => number;
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

		const observer = new ResizeObserver(([element]) => {
			setWidth(element.contentRect.width);
		})

		observer.observe(element);
		return () => {
			observer.disconnect();
		}
	}, [ref])

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

	const getWidth = (): number => {
		return width;
	}

	return { toX, toDate, getWidth }
}

