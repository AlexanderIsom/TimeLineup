'use client'
import React, { SyntheticEvent, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import Timeline from "@/utils/Timeline";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import styles from "@/styles/Components/TimelineCard.module.scss";
import MathUtils from "@/utils/MathUtils";
import "@/styles/Components/Resizable.css"
import { Schedule } from "../events/ClientCardContainer";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

interface Props {
	schedule: Schedule;
	handleUpdate: (id: string, startTime: number, duration: number) => void;
	handleDelete: (id: string) => void;
}

export default function ResizableTimeCard(props: Props) {
	const [state, setState] = useState({
		duration: props.schedule.duration,
		start: props.schedule.start,
		width: Timeline.minutesToXPosition(props.schedule.duration),
	});

	const minWidth = Timeline.minutesToXPosition(30);
	const bounds = Timeline.getBounds();

	const onResize = (e: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
		setState((state) => {
			let newX = state.start;
			let newWidth = size.width;
			const deltaWidth = state.width - size.width;
			if (handle === "w") {
				newX = state.start + Timeline.xPositionToMinutes(deltaWidth)
				if (Timeline.minutesToXPosition(newX) < bounds.min) {
					return state
				}
			}
			if (size.width < minWidth || Timeline.minutesToXPosition(newX) + newWidth > bounds.max) {
				return state;
			}
			return { duration: Timeline.xPositionToMinutes(newWidth), start: newX, width: newWidth };
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
			<ContextMenuTrigger>
				<Draggable
					axis="x"
					position={{ x: Timeline.minutesToXPosition(state.start), y: 0 }}
					handle=".dragHandle"
					onDrag={onDrag}
					onStop={onDragStopped}
					bounds={{ left: bounds.min, right: bounds.max - state.width }}
				>
					<div
						className={styles.container}
						style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}
					>
						<Resizable className={styles.container} width={Timeline.minutesToXPosition(state.duration)} height={0} resizeHandles={["e", "w"]} onResize={onResize} onResizeStop={onResizeStop}>
							<div style={{ width: `${Timeline.minutesToXPosition(state.duration)}px` }}>
								<div className={`dragHandle ${styles.timeContainer} ${"hover:cursor-grab active:cursor-grabbing"}`}>
									<span className={"p-3 align-center text-ellipsis overflow-hidden font-semibold"}>{Timeline.formatMinutes(state.start)}</span>
									<span className={"p-3 align-center text-ellipsis overflow-hidden font-semibold"}>
										{Timeline.formatMinutes(state.start + state.duration)}
									</span>
								</div>
							</div>
						</Resizable>
					</div>
				</Draggable>

			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => {
					props.handleDelete(props.schedule.id);
				}}>Delete</ContextMenuItem>
				<ContextMenuItem>Cancel</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>

	);
}
