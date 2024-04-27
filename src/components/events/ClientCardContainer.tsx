"use client"

import { useRef } from "react"
import ResizableTimeCard from "../id/ResizableTimeCard"
import { nanoid } from "nanoid"
import Timeline from "@/utils/Timeline"
import styles from "./clientCardContainer.module.scss"
import { useSegmentStore, TimeSegment } from "@/store/Segments"
import { addMinutes, areIntervalsOverlapping, max, min, roundToNearestMinutes } from "date-fns"

export default function ClientCardContainer() {
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
		const duration = 60;
		var rectBounds = timelineContainerRef.current!.getBoundingClientRect();
		var timelineBounds = Timeline.getBounds();
		let start = Math.max(e.clientX - rectBounds.left, timelineBounds.min)
		const durationInX = Timeline.minutesToX(duration);
		if (start + durationInX > timelineBounds.max) {
			start = timelineBounds.max - durationInX;
		}

		const startDate = roundToNearestMinutes(Timeline.XToDate(start), { nearestTo: 5 })
		const endDate = addMinutes(startDate, duration);

		const newSegment: TimeSegment = { id: nanoid(), start: startDate, end: endDate };
		const foundOverlaps = removeOverlappingSegments(newSegment);
		if (!foundOverlaps) {
			segmentStore.addSegment(newSegment);
		}
	}

	return (
		<div className={`${styles.container} bounds`} onDoubleClick={handleDoubleClick} ref={timelineContainerRef}>
			{segmentStore.segments.map((segment: TimeSegment, index) => {
				return <ResizableTimeCard
					key={segment.id}
					segment={segment}
					handleUpdate={handleUpdate}
				/>
			})}
		</div>
	)
}