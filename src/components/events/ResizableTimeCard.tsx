'use client'
import React, { SyntheticEvent, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import Timeline from "@/utils/Timeline";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import styles from "@/styles/Components/TimelineCard.module.scss";
import MathUtils from "@/utils/MathUtils";
import "@/styles/Components/Resizable.css"
import { Schedule } from "./ClientCardContainer";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

interface Props {
	schedule: Schedule;
	handleUpdate: (id: string, startTime: number, duration: number) => void;
	handleDelete: (id: string) => void;
	bounds: { startDate: Date; endDate: Date };
}

export default function ResizableTimeCard(props: Props) {
	const [state, setState] = useState({
		duration: props.schedule.duration,
		start: props.schedule.start,
		width: Timeline.minutesToXPosition(props.schedule.duration),
	});

	const minWidth = Timeline.minutesToXPosition(30);
	const maxBounds = Timeline.dateToXPosition(props.bounds.endDate);

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
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
		props.handleUpdate(props.schedule.id, offsetFromStart, duration);
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
		<ContextMenu>
			<ContextMenuTrigger><Draggable
				axis="x"
				position={{ x: Timeline.minutesToXPosition(state.start), y: 0 }}
				handle=".dragHandle"
				onDrag={onDrag}
				onStop={onDragStopped}
				bounds={{ left: Timeline.dateToXPosition(props.bounds.startDate), right: Timeline.dateToXPosition(props.bounds.endDate) - state.width }}
			>
				<div
					className={styles.container}
					style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}
				>
					<Resizable className={styles.container} width={Timeline.minutesToXPosition(state.duration)} height={0} resizeHandles={["e", "w"]} onResize={onResize} onResizeStop={onResizeStop}>
						<div style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}>
							<div className={`dragHandle ${styles.timeContainer} ${styles.grabbable}`}>
								<span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(props.bounds.startDate, state.start), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span>
								<span className={styles.timeCue}>
									{format(roundToNearestMinutes(addMinutes(props.bounds.startDate, state.start + state.duration), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}
								</span>
							</div>
						</div>
					</Resizable>
				</div>
			</Draggable></ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => {
					props.handleDelete(props.schedule.id);
				}}>Delete</ContextMenuItem>
				<ContextMenuItem>Cancel</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>

	);
}
