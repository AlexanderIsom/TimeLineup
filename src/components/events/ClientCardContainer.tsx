"use client"

import { useRef } from "react"
import ResizableTimeCard from "../id/ResizableTimeCard"
import { nanoid } from "nanoid"
import styles from "./clientCardContainer.module.scss"
import { useSegmentStore, TimeSegment } from "@/store/Segments"
import { addMinutes, areIntervalsOverlapping, max, min, roundToNearestMinutes, subMinutes } from "date-fns"


interface Props {
	minuteWidth: number
	eventStartTime: Date
	eventEndTime: Date
}

const newDuration = 60;

export default function ClientCardContainer({ minuteWidth, eventStartTime, eventEndTime }: Props) {
	const timelineContainerRef = useRef<HTMLDivElement>(null);

	const segmentStore = useSegmentStore((state) => state)

	function removeOverlappingSegments(segment: TimeSegment) {
		const overlaps = segmentStore.segments.filter(item => {
			if (item.id === segment.id) return false;
			return areIntervalsOverlapping({ start: segment.start, end: segment.end }, { start: item.start, end: item.end })
		});

		if (overlaps.length > 0) {
			const largest = max([...overlaps.map(o => o.end), segment.end])
			const smallest = min([...overlaps.map(o => o.start), segment.start])
			const deletes = [...overlaps.map(o => o.id), segment.id]

			deletes.forEach((overlapId) => {
				segmentStore.deleteSegment(overlapId);
			});
			segmentStore.addSegment({ id: nanoid(), start: smallest, end: largest })
			return true;
		}

		return false;
	}

	function handleUpdate(segment: TimeSegment) {
		const foundOverlaps = removeOverlappingSegments(segment);

		if (!foundOverlaps) {
			segmentStore.updateSegment(segment)
		}
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		var x = e.clientX - timelineContainerRef.current!.getBoundingClientRect().left;
		const startDate = min([max([roundToNearestMinutes(addMinutes(eventStartTime, x / minuteWidth), { nearestTo: 5 }), eventStartTime]), subMinutes(eventEndTime, newDuration)])
		const endDate = addMinutes(startDate, newDuration);

		const newSegment: TimeSegment = { id: nanoid(), start: startDate, end: endDate };
		const foundOverlaps = removeOverlappingSegments(newSegment);
		if (!foundOverlaps) {
			segmentStore.addSegment(newSegment);
		}
	}

	return (
		<div className={styles.container} onDoubleClick={handleDoubleClick} ref={timelineContainerRef}>
			{segmentStore.segments.map((segment: TimeSegment, index) => {
				return <ResizableTimeCard
					minuteWidth={minuteWidth}
					eventEndTime={eventEndTime}
					eventStartTime={eventStartTime}
					key={segment.id}
					segment={segment}
					handleUpdate={handleUpdate}
				/>
			})}
		</div>
	)
}