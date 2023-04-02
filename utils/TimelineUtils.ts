import { addSeconds, differenceInSeconds } from "date-fns";

export interface TimelineUtils {
	toX: (from: any) => number;
	toDate: (x: number) => Date;
}

interface props {
	start: string;
	end: string;
}

export default function CreateTimeline({ start, end }: props): TimelineUtils {
	const width = 1920
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

	return { toX, toDate }
}

