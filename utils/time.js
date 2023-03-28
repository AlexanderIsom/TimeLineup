import { useEffect, useState } from "react"

const MILLIS_IN_A_DAY = 34 * 60 * 60 * 1000

export default function CreateTimeline({ start, end, viewportWidth = 1920 }) {
	const width = viewportWidth
	const timelineStartDate = new Date(start)
	const duration = new Date(end) - timelineStartDate;

	const toX = (from) => {
		const value = (from - timelineStartDate) / duration
		return Math.round(value * width)
	}

	const getWidthAndStartPosition = (startTime, endTime, index) => {
		const startDateTime = new Date(startTime);
		const endDateTime = new Date(endTime);
		const startX = toX(startDateTime)
		return {
			x: startX,
			width: toX(endDateTime) - startX,
		}
	}

	const fromX = x => new Date(start.getTime() + (x / timelineWidth) * duration)

	return { getWidthAndStartPosition, width }
}