import { TimeDuration } from 'types/Events'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import Timeline from 'utils/Timeline'
import { addMinutes, differenceInMinutes, format, roundToNearestMinutes, } from 'date-fns'
import styles from 'styles/Components/TimelineCard.module.scss'
import MathUtils from 'utils/MathUtils'

interface Props {
	schedule: TimeDuration
	updateHandler: (id: string, offsetFromStart: number, duration: number) => void
	onContext: (event: React.MouseEvent, pairId: string) => void;
	bounds: { start: Date, end: Date };
}

export default function ResizableTimeCard({
	schedule,
	updateHandler,
	onContext,
	bounds
}: Props) {
	const [state, setState] = useState({
		duration: schedule.duration,
		offsetFromStart: schedule.offsetFromStart,
		width: Timeline.minutesToXPosition(schedule.duration)
	})

	const minWidth = Timeline.minutesToXPosition(30);
	const maxBounds = Timeline.dateToXPosition(bounds.end)

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		setState((state) => {
			let newOffset = state.offsetFromStart;
			let newSize = size.width
			const deltaWidth = state.width - size.width;
			if (handle === 'w') {
				newOffset = state.offsetFromStart + Timeline.xPositionToMinutes(deltaWidth);
			}
			if (size.width < minWidth) {
				return state
			}
			if (newOffset < 0)
				return state;

			if (Timeline.minutesToXPosition(newOffset) + newSize > maxBounds)
				return state;

			return { duration: Timeline.xPositionToMinutes(newSize), offsetFromStart: newOffset, width: newSize }
		})
	}

	const moveAndResizeToNearest15Minutes = () => {
		const offsetFromStart = MathUtils.roundToNearest(state.offsetFromStart, Timeline.getSnapToNearestMinutes())
		const newEnd = MathUtils.roundToNearest(state.offsetFromStart + state.duration, Timeline.getSnapToNearestMinutes())
		const duration = newEnd - offsetFromStart
		const width = Timeline.minutesToXPosition(duration)

		setState(() => {
			return { offsetFromStart: offsetFromStart, duration: duration, width: width }
		})
		updateHandler(schedule.id, offsetFromStart, duration)
	}

	const onResizeStop = (e: SyntheticEvent | MouseEvent) => {
		moveAndResizeToNearest15Minutes();
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setState({ offsetFromStart: Timeline.xPositionToMinutes(ui.x), duration: state.duration, width: state.width })
	}

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		moveAndResizeToNearest15Minutes();
	}

	return (
		<Draggable
			axis='x'
			position={{ x: Timeline.minutesToXPosition(state.offsetFromStart), y: 0 }}
			handle='.dragHandle'
			onDrag={onDrag}
			onStop={onDragStopped}
			bounds={{ left: Timeline.dateToXPosition(bounds.start), right: Timeline.dateToXPosition(bounds.end) - state.width }}
		>
			<div className={styles.container} style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }} onContextMenu={(e) => { onContext(e, schedule.id) }}>
				<Resizable
					className={styles.container}
					width={Timeline.minutesToXPosition(state.duration)}
					height={0}
					resizeHandles={['e', 'w']}
					onResize={onResize}
					onResizeStop={onResizeStop}
				>
					<div style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}>
						<div className={`dragHandle ${styles.timeContainer} ${styles.grabbable}`} >
							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(addMinutes(bounds.start, state.offsetFromStart), { nearestTo: Timeline.getSnapToNearestMinutes() }),
									'HH:mm'
								)}
							</span>
							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(addMinutes(bounds.start, state.offsetFromStart + state.duration), { nearestTo: Timeline.getSnapToNearestMinutes() }),
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
