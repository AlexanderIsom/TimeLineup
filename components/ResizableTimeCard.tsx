import { EventResponse } from 'types/Events'
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
	response: EventResponse
	timeline: TimelineUtils
	updateHandler: (id: string, start: Date, end: Date) => void
	onMouseOverHandler: (resposne: EventResponse | undefined) => void;
	dragAndResizeHandler: (value: boolean) => void;
	bounds: { start: Date, end: Date };
}

export default function ResizableTimeCard({
	response,
	timeline,
	updateHandler,
	onMouseOverHandler,
	dragAndResizeHandler,
	bounds
}: Props) {
	const [startTime, setStartTime] = useState(new Date(response.startDateTime))
	const [endTime, setEndTime] = useState(new Date(response.endDateTime))

	const startX = timeline.toX(startTime)
	const endX = timeline.toX(endTime)

	const [duration, setDuration] = useState(
		differenceInSeconds(endTime, startTime)
	)

	function clampDateWithinBounds(date: Date): Date {
		return clamp(date, { start: bounds.start, end: bounds.end });
	}

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		dragAndResizeHandler(true);
		const newSize = size.width

		if (handle === 'w') {
			setStartTime(clampDateWithinBounds(timeline.toDate(startX + (endX - startX - newSize))))
		}

		if (handle === 'e') {
			setEndTime(clampDateWithinBounds(timeline.toDate(startX + newSize)))
		}
	}

	const onResizeStop = () => {
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		setDuration(differenceInSeconds(newEndTime, newStartTime))
		updateHandler(response.id, newStartTime, newEndTime)
		dragAndResizeHandler(false);
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		dragAndResizeHandler(true);
		if (endX + ui.deltaX >= timeline.getWidth()) {
			return;
		}

		const newStartTime = timeline.toDate(ui.x)
		const newEndTime = addSeconds(newStartTime, duration)
		setStartTime(newStartTime)
		setEndTime(newEndTime)
	}

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		updateHandler(response.id, newStartTime, newEndTime)
		dragAndResizeHandler(false);
	}

	const handleMouseEnter = () => {
		onMouseOverHandler(response);
	}

	const handleMouseLeave = () => {
		onMouseOverHandler(undefined);
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
				<div style={{ width: `${endX - startX}px` }} className={styles.content} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
