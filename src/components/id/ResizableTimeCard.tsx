"use client";
import "@/styles/Resizable.css";

import React, { SyntheticEvent, useState } from "react";
import Draggable from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { TimeSegment, useSegmentStore } from "@/stores/segmentStore";
import { addMinutes, differenceInMinutes, format, roundToNearestMinutes } from "date-fns";
import MathUtils from "@/utils/MathUtils";

interface Props {
	minuteWidth: number;
	eventStartTime: Date;
	eventEndTime: Date;
	segment: TimeSegment;
	handleUpdate: (segment: TimeSegment) => void;
}

const snapToNearestXMinutes = 5;
const minWidth = 30;

export default function ResizableTimeCard({ minuteWidth, eventStartTime, eventEndTime, segment, handleUpdate }: Props) {
	const store = useSegmentStore((state) => state);
	const nodeRef = React.useRef(null);
	const [times, setTimes] = useState({ start: segment.start, end: segment.end });
	const [state, setState] = useState({
		x: differenceInMinutes(segment.start, eventStartTime),
		width: differenceInMinutes(segment.end, segment.start),
	});
	const maxBounds = differenceInMinutes(eventEndTime, eventStartTime);

	const onResize = (e: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
		let newX = state.x;
		let newWidth = size.width / minuteWidth;
		let deltaWidth = state.width - newWidth;

		if (handle === "w") {
			newX = state.x + deltaWidth;
		}
		if (newX < 0 || newX + newWidth > maxBounds) return;

		setState({ x: newX, width: newWidth });
		updateTimes(newX, newX + newWidth);
	};

	const updateCard = () => {
		handleUpdate({ id: segment.id, start: times.start, end: times.end });
	};

	const updateTimes = (x: number, w: number) => {
		setTimes({
			start: roundToNearestMinutes(addMinutes(eventStartTime, x), { nearestTo: 5 }),
			end: roundToNearestMinutes(addMinutes(eventStartTime, w), { nearestTo: 5 }),
		});
	};

	return (
		<ContextMenu>
			<Draggable
				axis="x"
				position={{ x: state.x * minuteWidth, y: 0 }}
				handle=".dragHandle"
				onDrag={(e, data) => {
					const newX = data.x / minuteWidth;
					setState({ ...state, x: newX });
					updateTimes(newX, newX + state.width);
				}}
				onStop={(e, data) => {
					const newX = MathUtils.roundToNearest(data.x, minuteWidth * snapToNearestXMinutes);
					setState({ ...state, x: newX / minuteWidth });
					updateCard();
				}}
				bounds={"parent"}
				nodeRef={nodeRef}
			>
				<ContextMenuTrigger asChild>
					<div
						ref={nodeRef}
						className="absolute flex h-14 items-center justify-center"
						style={{ width: state.width * minuteWidth + "px" }}
					>
						<Resizable
							className="absolute flex h-14 items-center justify-center"
							width={state.width * minuteWidth}
							height={0}
							resizeHandles={["e", "w"]}
							minConstraints={[minWidth * minuteWidth, 0]}
							onResize={onResize}
							draggableOpts={{ bounds: "parent" }}
							onResizeStop={(e, { size, handle }) => {
								const newX =
									MathUtils.roundToNearest(
										state.x * minuteWidth,
										minuteWidth * snapToNearestXMinutes,
									) / minuteWidth;
								const wDelta = state.x - newX;
								const newWidth =
									MathUtils.roundToNearest(
										(state.width + wDelta) * minuteWidth,
										minuteWidth * snapToNearestXMinutes,
									) / minuteWidth;
								updateTimes(newX, newX + newWidth);
								setState({ x: newX, width: newWidth });
								updateCard();
							}}
						>
							<div
								className="absolute flex h-14 w-full items-center justify-between overflow-hidden rounded-md bg-gray-100 shadow-md shadow-gray-200"
								style={{ width: state.width * minuteWidth + "px" }}
							>
								<div className="dragHandle flex items-center justify-between hover:cursor-grab active:cursor-grabbing">
									<span className={"align-center overflow-hidden text-ellipsis p-3 font-semibold"}>
										{format(times.start, "HH:mm")}
									</span>
									<span className={"align-center overflow-hidden text-ellipsis p-3 font-semibold"}>
										{format(times.end, "HH:mm")}
									</span>
								</div>
							</div>
						</Resizable>
					</div>
				</ContextMenuTrigger>
			</Draggable>

			<ContextMenuContent>
				<ContextMenuItem
					onSelect={() => {
						store.deleteSegment(segment.id);
					}}
				>
					Delete
				</ContextMenuItem>
				<ContextMenuItem>Cancel</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
