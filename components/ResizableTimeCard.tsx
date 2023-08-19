import { TimeDuration } from 'types/Events'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { TimelineUtils } from 'utils/TimelineUtils'
import { differenceInMinutes, format, roundToNearestMinutes, } from 'date-fns'
import styles from 'styles/Components/TimelineCard.module.scss'

interface Props {
	schedule: TimeDuration
	timeline: TimelineUtils
	updateHandler: (id: string, start: Date, duration: number) => void
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
	const [state, setState] = useState({
		width: timeline.widthFromMinutes(schedule.duration),
		left: timeline.toX(schedule.start)
	})

	const minWidth = timeline.widthFromMinutes(30);

	const [inUse, setInUse] = useState(false);

	useEffect(() => {
		if (inUse) {
			return;
		}
		const newState = {
			width: timeline.widthFromMinutes(schedule.duration),
			left: timeline.toX(schedule.start)
		}
		if (newState.width !== state.width || newState.left !== state.left) {
			setState(newState)
		}

	}, [timeline, schedule, state, inUse])

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		setInUse(true);

		setState((state) => {
			let newLeft = state.left;
			let newSize = size.width
			const deltaWidth = state.width - size.width;
			if (handle === 'w') {
				newLeft = state.left + deltaWidth
			}
			if (size.width <= minWidth) {
				newLeft = state.left
				newSize = minWidth
			}

			return { width: newSize, left: newLeft }
		})
	}

	const moveAndResizeToNearest15Minutes = () => {
		const newStart = roundToNearestMinutes(timeline.toDate(state.left), { nearestTo: 15 });
		const newEnd = roundToNearestMinutes(timeline.toDate(state.left + state.width), { nearestTo: 15 });
		setState(() => {
			const newLeft = timeline.toX(newStart)
			const newRight = timeline.toX(newEnd)
			return { width: newRight - newLeft, left: newLeft }
		})
		updateHandler(schedule.id, newStart, differenceInMinutes(newEnd, newStart))
	}

	const onResizeStop = (e: SyntheticEvent | MouseEvent) => {
		if (!inUse) {
			onClickHandler(e as React.MouseEvent, schedule.id);
			return;
		}
		moveAndResizeToNearest15Minutes();
		setInUse(false);
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setInUse(true);
		setState({ width: state.width, left: ui.x })
	}

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		if (!inUse) {
			onClickHandler(e as React.MouseEvent, schedule.id);
			return;
		}
		moveAndResizeToNearest15Minutes();
		setInUse(false);
	}

	return (
		<Draggable
			axis='x'
			position={{ x: state.left, y: 0 }}
			handle='.dragHandle'
			onDrag={onDrag}
			onStop={onDragStopped}
			bounds={{ left: 0, right: timeline.toX(bounds.end) - state.width }}
		>
			<div className={styles.container} style={{ width: `${state.width}px` }}>
				<Resizable
					className={styles.container}
					width={state.width}
					height={0}
					resizeHandles={['e', 'w']}
					onResize={onResize}
					onResizeStop={onResizeStop}
				>
					<div style={{ width: `${state.width}px` }}>
						<div className={`dragHandle ${styles.timeContainer}`} >

							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(timeline.toDate(state.left), { nearestTo: 15 }),
									'HH:mm'
								)}
							</span>
							<span className={styles.timeCue}>
								{format(
									roundToNearestMinutes(timeline.toDate(state.left + state.width), { nearestTo: 15 }),
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
