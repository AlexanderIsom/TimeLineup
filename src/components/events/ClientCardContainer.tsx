"use client";

import { useEffect, useRef } from "react";
import ResizableTimeCard from "../id/ResizableTimeCard";

import { useSegmentStore, TimeSegment } from "@/store/Segments";
import { addMinutes, areIntervalsOverlapping, max, min, roundToNearestMinutes, subMinutes } from "date-fns";
import { useDebouncedCallback } from "use-debounce";
import { Event } from "@/db/schema";
import { saveSegments } from "@/actions/idActions";
import { nanoid } from "nanoid";

interface Props {
	minuteWidth: number;
	eventData: Event;
	localId: string;
}

const newDuration = 60;

export default function ClientCardContainer({ minuteWidth, eventData, localId }: Props) {
	const timelineContainerRef = useRef<HTMLDivElement>(null);

	const segmentStore = useSegmentStore((state) => state);

	const debounceUpdate = useDebouncedCallback(async () => {
		await saveSegments(
			localId,
			eventData.id,
			segmentStore.newSegments,
			segmentStore.deletedSegments,
			segmentStore.updatedSegments,
		);
	}, 10000);

	useEffect(
		() => () => {
			debounceUpdate.flush();
		},
		[debounceUpdate],
	);

	function removeOverlappingSegments(segment: TimeSegment) {
		const overlaps = segmentStore.segments.filter((item) => {
			if (item.id === segment.id) return false;
			return areIntervalsOverlapping(
				{ start: segment.start, end: segment.end },
				{ start: item.start, end: item.end },
			);
		});

		if (overlaps.length > 0) {
			const largest = max([...overlaps.map((o) => o.end), segment.end]);
			const smallest = min([...overlaps.map((o) => o.start), segment.start]);
			const deletes = [...overlaps.map((o) => o.id), segment.id];

			deletes.forEach((overlapId) => {
				segmentStore.deleteSegment(overlapId);
			});
			segmentStore.addSegment({ id: nanoid(), start: smallest, end: largest });
			return true;
		}

		return false;
	}

	function handleUpdate(segment: TimeSegment) {
		const foundOverlaps = removeOverlappingSegments(segment);

		if (!foundOverlaps) {
			segmentStore.updateSegment(segment);
		}
		debounceUpdate();
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		var x = e.clientX - timelineContainerRef.current!.getBoundingClientRect().left;
		const startDate = min([
			max([
				roundToNearestMinutes(addMinutes(eventData.start, x / minuteWidth), { nearestTo: 5 }),
				eventData.start,
			]),
			subMinutes(eventData.end, newDuration),
		]);
		const endDate = addMinutes(startDate, newDuration);

		const newSegment: TimeSegment = { id: nanoid(), start: startDate, end: endDate };
		const foundOverlaps = removeOverlappingSegments(newSegment);
		if (!foundOverlaps) {
			segmentStore.addSegment(newSegment);
		}
	};

	return (
		<div
			className="relative flex h-16 items-center hover:cursor-pointer"
			onDoubleClick={handleDoubleClick}
			ref={timelineContainerRef}
			onClick={() => {
				console.log("clicked");
			}}
		>
			{segmentStore.segments.map((segment: TimeSegment, index) => {
				return (
					<ResizableTimeCard
						minuteWidth={minuteWidth}
						eventEndTime={eventData.end}
						eventStartTime={eventData.start}
						key={segment.id}
						segment={segment}
						handleUpdate={handleUpdate}
					/>
				);
			})}
		</div>
	);
}
