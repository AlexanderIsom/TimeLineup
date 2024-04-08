"use client"

import { useRef } from "react"
import ResizableTimeCard from "./ResizableTimeCard"
import { nanoid } from "nanoid"
import MathUtils from "@/utils/MathUtils"
import Timeline from "@/utils/Timeline"
import styles from "@/styles/Components/Events/id.module.scss"

export interface Schedule {
	id: string
	start: number
	duration: number
}

interface Props {
	schedules: Array<Schedule>
	eventStartDate: Date;
	eventEndDate: Date;
	updateState: (newSchedule: Schedule[]) => void;
}

export default function ClientCardContainer(props: Props) {
	const timelineContainerRef = useRef<HTMLDivElement>(null);

	function handleCreate(start: number, duration: number, table: Schedule[]): Schedule[] {
		const newSchedule = Array.from(table);
		newSchedule.push({ start: start, duration: duration, id: nanoid() })
		return newSchedule;
	}

	function deleteIdFromTable(idToDelete: string, table: Schedule[]): Schedule[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function findOverlappingResponses(table: Array<Schedule>, startTime: number, duration: number): Array<Schedule> {
		const overlappingResponses = table.filter(item => {
			const startIsWithin = MathUtils.isBetween(item.start, startTime, startTime + duration)
			const endIsWithin = MathUtils.isBetween(item.start + item.duration, startTime, startTime + duration)

			const queryStartIsWithin = MathUtils.isBetween(startTime, item.start, item.start + item.duration)
			const queryEndIsWithin = MathUtils.isBetween(startTime + duration, item.start, item.start + item.duration)

			if (startIsWithin || endIsWithin || queryStartIsWithin || queryEndIsWithin) {
				return true;
			}
		});
		return overlappingResponses;
	}

	function handleUpdate(id: string, startTime: number, duration: number) {
		let otherResponses = props.schedules.filter((s) => {
			return s.id !== id
		});

		const overlaps = findOverlappingResponses(otherResponses, startTime, duration);

		if (overlaps.length > 0) {
			const startTimes = overlaps.map(e => e.start)
			const endTimes = overlaps.map(e => e.start + e.duration)
			startTimes.push(startTime);
			endTimes.push(startTime + duration)
			const start = Math.min(...startTimes)
			const end = Math.max(...endTimes)

			overlaps.forEach(event => {
				otherResponses = deleteIdFromTable(event.id, otherResponses);
			});
			otherResponses = handleCreate(start, end - start, otherResponses)
		} else {
			otherResponses.push({ id: id, start: startTime, duration: duration })
		}
		props.updateState(otherResponses);
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		var bounds = timelineContainerRef.current!.getBoundingClientRect();
		const width = e.clientX - bounds.left;
		const offsetFromStart = MathUtils.roundToNearest(Timeline.xPositionToMinutes(width), 5)
		const duration = 60;

		const overlaps = findOverlappingResponses(props.schedules, offsetFromStart, duration);

		if (overlaps.length === 0) {
			const newSchedule = handleCreate(offsetFromStart, duration, props.schedules)
			props.updateState(newSchedule);
		}
	}

	function handleDelete(id: string) {
		const newSchedule = deleteIdFromTable(id, props.schedules)
		props.updateState(newSchedule);
	}

	return (<>
		<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick} ref={timelineContainerRef}>
			{props.schedules.map((schedule: Schedule) => {
				return <ResizableTimeCard
					key={schedule.id}
					schedule={schedule}
					handleUpdate={handleUpdate}
					handleDelete={handleDelete}
					bounds={{ startDate: props.eventStartDate, endDate: props.eventEndDate }}
				/>
			})}
		</div>
	</>

	)
}