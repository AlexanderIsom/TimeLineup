import { TimePair } from 'types/Events'
import React, { SyntheticEvent, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { TimelineUtils } from 'utils/TimelineUtils'
import {
	addMinutes,
	addSeconds,
	clamp,
	differenceInSeconds,
	format,
	roundToNearestMinutes,
	subMinutes,
	subSeconds,
} from 'date-fns'
import styles from 'styles/Components/TimelineCard.module.scss'

interface Props {
	schedule: TimePair
	timeline: TimelineUtils
	updateHandler: (id: string, tart: Date, end: Date) => void
	onClickHandler: (event: React.MouseEvent, pairId: string) => void;
	bounds: { start: Date, end: Date };
}

export default function ResizableTimeCard({
	schedule,
	timeline,
	updateHandler,
	onClickHandler,
	bounds
}: Props) {
	const [startTime, setStartTime] = useState(new Date(schedule.start))
	const [endTime, setEndTime] = useState(new Date(schedule.end))
	const [inUse, setInUse] = useState(false);

	let startX = timeline.toX(startTime)
	let endX = timeline.toX(endTime)

	const [duration, setDuration] = useState(
		differenceInSeconds(endTime, startTime)
	)

	function clampDateWithinBounds(date: Date, start: Date, end: Date): Date {
		return clamp(date, { start: start, end: end });
	}

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		setInUse(true);

		if (handle === 'w') {
			setStartTime(clampDateWithinBounds(timeline.toDate(endX - size.width), bounds.start, subMinutes(endTime, 30)))
			return;
		}

		if (handle === 'e') {
			setEndTime(clampDateWithinBounds(timeline.toDate(startX + size.width), addMinutes(startTime, 30), bounds.end))
			return;
		}
	}

	const onResizeStop = (e: SyntheticEvent | MouseEvent) => {
		if (!inUse) {
			onClickHandler(e as React.MouseEvent, schedule.id);
			return;
		}
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		setDuration(differenceInSeconds(newEndTime, newStartTime))
		updateHandler(schedule.id, newStartTime, newEndTime);
		setInUse(false);
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setInUse(true);
		const newStartTime = timeline.toDate(ui.x);
		const newEndTime = addSeconds(newStartTime, duration)

		if (newEndTime > bounds.end) {
			return;
		}

		setStartTime(newStartTime)
		setEndTime(newEndTime)

	}

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		if (!inUse) {
			onClickHandler(e as React.MouseEvent, schedule.id);
			return;
		}
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		updateHandler(schedule.id, newStartTime, newEndTime)
		setInUse(false);
	}

	return (
		<Draggable
			axis='x'
			position={{ x: startX, y: 0 }}
			handle='.dragHandle'
			onDrag={onDrag}
			onStop={onDragStopped}
			bounds={{ left: 0, right: timeline.toX(subSeconds(bounds.end, duration)) }}
		>
			<div className={styles.container} style={{ width: `${endX - startX}px` }}>hello
				<Resizable
					className={styles.container}
					width={endX - startX}
					height={0}
					resizeHandles={['e', 'w']}
					onResize={onResize}
					onResizeStop={onResizeStop}
				>
					<div style={{ width: `${endX - startX}px` }}>
						<div className={`dragHandle ${styles.timeContainer}`} >

							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(startTime, { nearestTo: 15 }),
									'HH:mm'
								)}
							</span>
							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(endTime, { nearestTo: 15 }),
									'HH:mm'
								)}
							</span>

						</div>
					</div>
				</Resizable>
			</div>
		</Draggable >
	)
}
