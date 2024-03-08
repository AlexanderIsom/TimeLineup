'use client'

import { useRef } from "react"
import ResizableTimeCard from "./ResizableTimeCard"
import { nanoid } from "nanoid"
import MathUtils from "@/utils/MathUtils"
import Timeline from "@/utils/Timeline"
import { differenceInMinutes } from "date-fns"
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
	const designSize = 1920
	const timelineContainerRef = useRef<HTMLDivElement>(null);

	const eventDurationMinutes = differenceInMinutes(props.eventEndDate, props.eventStartDate)
	new Timeline(props.eventStartDate, eventDurationMinutes, designSize, 5)

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

		const overlappingEvents = findOverlappingResponses(otherResponses, startTime, duration);

		if (overlappingEvents.length > 0) {
			const startTimes = overlappingEvents.map(e => e.start)
			const endTimes = overlappingEvents.map(e => e.start + e.duration)
			startTimes.push(startTime);
			endTimes.push(startTime + duration)
			const start = Math.min(...startTimes)
			const end = Math.max(...endTimes)

			overlappingEvents.forEach(event => {
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

		const lapping = findOverlappingResponses(props.schedules, offsetFromStart, duration);

		if (lapping.length === 0) {
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