'use client'
import "@/styles/Components/Resizable.css"

import React, { SyntheticEvent, useState } from "react";
import Draggable from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import Timeline from "@/utils/Timeline";
import styles from "./TimelineCard.module.scss";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { TimeSegment, useSegmentStore } from "@/store/Segments";
import { differenceInMinutes, format, } from "date-fns";

interface Props {
	segment: TimeSegment;
	handleUpdate: (segment: TimeSegment) => void;
}

export default function ResizableTimeCard(props: Props) {
	const store = useSegmentStore((state) => state);
	const nodeRef = React.useRef(null);
	const [state, setState] = useState({
		x: Timeline.dateToX(props.segment.start),
		width: Timeline.minutesToX(differenceInMinutes(props.segment.end, props.segment.start)),
	});

	const [timeSpan, setTimeSpan] = useState({
		start: props.segment.start,
		end: props.segment.end
	})

	const minWidth = Timeline.minutesToX(30);
	const bounds = Timeline.getBounds();

	const onResize = (e: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
		let newX = state.x;
		let newWidth = size.width;
		const deltaWidth = state.width - newWidth;

		if (handle === "w") {
			newX = state.x + deltaWidth
		}
		const startDate = Timeline.XToDate(Timeline.snapXToNearestMinutes(newX))
		const endDate = Timeline.XToDate(Timeline.snapXToNearestMinutes(newX + newWidth))
		setTimeSpan({ start: startDate, end: endDate })

		setState((currentState) => {
			if (Timeline.minutesToX(newX) < bounds.min) {
				return currentState
			}

			if (size.width < minWidth || newX + newWidth > bounds.max) {
				return currentState;
			}
			return { x: newX, width: newWidth };
		})
	};

	const handleUpdate = () => {
		props.handleUpdate({ id: props.segment.id, start: timeSpan.start, end: timeSpan.end })
	}

	return (
		<ContextMenu>
			<Draggable
				axis="x"
				position={{ x: state.x, y: 0 }}
				handle=".dragHandle"
				onDrag={(e, data) => {
					const newX = Timeline.snapXToNearestMinutes(data.x)
					const startDate = Timeline.XToDate(newX)
					const endDate = Timeline.XToDate(newX + state.width)
					setTimeSpan({ start: startDate, end: endDate })
				}}
				onStop={(e, data) => {
					setState({ ...state, x: Timeline.snapXToNearestMinutes(data.x) })
					handleUpdate();
				}}
				bounds={{ left: bounds.min, right: bounds.max - state.width }}
				nodeRef={nodeRef}
			>
				<ContextMenuTrigger asChild>
					<div
						ref={nodeRef}
						className={styles.container}
						style={{ width: `${state.width}px` }}
					>
						<Resizable
							className={styles.container}
							width={state.width}
							height={0}
							resizeHandles={["e", "w"]}
							onResize={onResize}
							onResizeStop={(e, data) => {
								const newX = Timeline.snapXToNearestMinutes(state.x);
								const newW = Timeline.snapXToNearestMinutes(state.x + data.size.width) - newX;
								setState({ ...state, x: newX, width: newW })
								handleUpdate();
							}}>
							<div style={{ width: `${state.width}px` }}>
								<div className={`dragHandle ${styles.timeContainer} ${"hover:cursor-grab active:cursor-grabbing"}`}>
									<span className={"p-3 align-center text-ellipsis overflow-hidden font-semibold"}>{format(timeSpan.start, "HH:mm")}</span>
									<span className={"p-3 align-center text-ellipsis overflow-hidden font-semibold"}>
										{format(timeSpan.end, "HH:mm")}
									</span>
								</div>
							</div>
						</Resizable>
					</div>
				</ContextMenuTrigger>
			</Draggable>

			<ContextMenuContent>
				<ContextMenuItem onSelect={() => {
					store.deleteSegment(props.segment.id)
				}}>Delete</ContextMenuItem>
				<ContextMenuItem>Cancel</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu >

	);
}
