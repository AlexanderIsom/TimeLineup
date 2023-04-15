import { TimePair } from 'types/Events'
import React, { SyntheticEvent, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { TimelineUtils } from 'utils/TimelineUtils'
import {
	addSeconds,
	clamp,
	differenceInSeconds,
	format,
	roundToNearestMinutes,
} from 'date-fns'
import styles from 'styles/Components/TimelineCard.module.scss'

interface Props {
	schedule: TimePair
	timeline: TimelineUtils
	updateHandler: (id: string, tart: Date, end: Date) => void
	onClickHandler: (event: React.MouseEvent, pairId: string) => void;
	hideContextHandler: () => void;
	bounds: { start: Date, end: Date };
}

export default function ResizableTimeCard({
	schedule,
	timeline,
	updateHandler,
	onClickHandler,
	hideContextHandler,
	bounds
}: Props) {
	const [startTime, setStartTime] = useState(new Date(schedule.start))
	const [endTime, setEndTime] = useState(new Date(schedule.end))
	const [inUse, setInUse] = useState(false);

	const startX = timeline.toX(startTime)
	const endX = timeline.toX(endTime)

	const [duration, setDuration] = useState(
		differenceInSeconds(endTime, startTime)
	)

	function clampDateWithinBounds(date: Date): Date {
		return clamp(date, { start: bounds.start, end: bounds.end });
	}

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		hideContextHandler();
		setInUse(true);
		const newSize = size.width

		if (handle === 'w') {
			setStartTime(clampDateWithinBounds(timeline.toDate(startX + (endX - startX - newSize))))
		}

		if (handle === 'e') {
			setEndTime(clampDateWithinBounds(timeline.toDate(startX + newSize)))
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
		hideContextHandler();
		setInUse(true);
		if (endX + ui.deltaX >= timeline.getWidth()) {
			return;
		}

		const newStartTime = timeline.toDate(ui.x)
		const newEndTime = addSeconds(newStartTime, duration)
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
			handle='.dragHandle'
			axis='x'
			position={{ x: startX, y: 0 }}
			onDrag={onDrag}
			onStop={onDragStopped}
			bounds={"parent"}

		>
			<Resizable
				className={styles.container}
				width={endX - startX}
				height={0}
				resizeHandles={['e', 'w']}
				onResize={onResize}
				onResizeStop={onResizeStop}
			>
				<div style={{ width: `${endX - startX}px` }} className={styles.content}>
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
		</Draggable >
	)
}
