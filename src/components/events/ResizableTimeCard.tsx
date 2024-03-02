'use client'
import React, { SyntheticEvent, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import Timeline from "@/utils/Timeline";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import styles from "@/styles/Components/TimelineCard.module.scss";
import MathUtils from "@/utils/MathUtils";
import "@/styles/Components/Resizable.css"

interface Props {
	id: string;
	start: number;
	duration: number;
	updateHandler: (id: string, start: number, duration: number) => void;
	bounds: { start: Date; end: Date };
}

export default function ResizableTimeCard(props: Props) {
	const [state, setState] = useState({
		duration: props.duration,
		start: props.start,
		width: Timeline.minutesToXPosition(props.duration),
	});

	const minWidth = Timeline.minutesToXPosition(30);
	const maxBounds = Timeline.dateToXPosition(props.bounds.end);

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		console.log("resizing")
		setState((state) => {
			let newOffset = state.start;
			let newSize = size.width;
			const deltaWidth = state.width - size.width;
			if (handle === "w") {
				newOffset = state.start + Timeline.xPositionToMinutes(deltaWidth);
			}
			if (size.width < minWidth || newOffset < 0 || Timeline.minutesToXPosition(newOffset) + newSize > maxBounds) {
				return state;
			}

			return { duration: Timeline.xPositionToMinutes(newSize), start: newOffset, width: newSize };
		});
	};

	const moveAndResizeToNearestMinutes = () => {
		const offsetFromStart = MathUtils.roundToNearest(state.start, Timeline.getSnapToNearestMinutes());
		const newEnd = MathUtils.roundToNearest(state.start + state.duration, Timeline.getSnapToNearestMinutes());
		const duration = newEnd - offsetFromStart;
		const width = Timeline.minutesToXPosition(duration);

		setState(() => {
			return { start: offsetFromStart, duration: duration, width: width };
		});
		props.updateHandler(props.id, offsetFromStart, duration);
	};

	const onResizeStop = (e: SyntheticEvent | MouseEvent) => {
		moveAndResizeToNearestMinutes();
	};

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setState({ start: Timeline.xPositionToMinutes(ui.x), duration: state.duration, width: state.width });
	};

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		moveAndResizeToNearestMinutes();
	};

	return (
		<Draggable
			axis="x"
			position={{ x: Timeline.minutesToXPosition(state.start), y: 0 }}
			handle=".dragHandle"
			onDrag={onDrag}
			onStop={onDragStopped}
			bounds={{ left: Timeline.dateToXPosition(props.bounds.start), right: Timeline.dateToXPosition(props.bounds.end) - state.width }}
		>
			<div
				className={styles.container}
				style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}
			// onContextMenu={(e) => {
			// 	onContext(e, props.id);
			// }}
			>
				<Resizable className={styles.container} width={Timeline.minutesToXPosition(state.duration)} height={0} resizeHandles={["e", "w"]} onResize={onResize} onResizeStop={onResizeStop}>
					<div style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}>
						<div className={`dragHandle ${styles.timeContainer} ${styles.grabbable}`}>
							<span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(props.bounds.start, state.start), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span>
							<span className={styles.timeCue}>
								{format(roundToNearestMinutes(addMinutes(props.bounds.start, state.start + state.duration), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}
							</span>
						</div>
					</div>
				</Resizable>
			</div>
		</Draggable>
	);
}
