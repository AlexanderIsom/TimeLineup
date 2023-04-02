import { EventResponse } from "../types/Events"
import { SyntheticEvent, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Resizable, ResizableBox, ResizeCallbackData } from 'react-resizable';
import { TimelineUtils } from "../utils/TimelineUtils";
import { addSeconds, differenceInSeconds, format, roundToNearestMinutes } from "date-fns";
interface Props {
	event: EventResponse
	timeline: TimelineUtils
}

export default function TimelineContainer({ event, timeline }: Props) {
	const [startTime, setStartTime] = useState(new Date(event.startDateTime));
	const [endTime, setEndTime] = useState(new Date(event.endDateTime));
	const [duration, setDuration] = useState(differenceInSeconds(startTime, endTime));

	const [x, setX] = useState(timeline.toX(startTime));
	const [width, setWidth] = useState(timeline.toX(endTime) - timeline.toX(startTime));

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		let newX = x;
		let newStartTime = startTime;
		if (handle === 'w') {
			newX = x + (width - size.width);
			setX(newX);
			newStartTime = roundToNearestMinutes(timeline.toDate(newX), { nearestTo: 15 })
			setStartTime(newStartTime);
		}

		const newEndTime = roundToNearestMinutes(timeline.toDate(x + size.width), { nearestTo: 15 })
		setEndTime(newEndTime);
		setWidth(size.width);
		setDuration(differenceInSeconds(newEndTime, newStartTime));
	};

	const onResizeStop = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		const newX = timeline.toX(startTime)
		setX(newX);
		setWidth(timeline.toX(endTime) - newX);
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setX(ui.x);
		const newStarttime = roundToNearestMinutes(timeline.toDate(ui.x), { nearestTo: 15 })
		const newEndTime = addSeconds(newStarttime, duration);
		setStartTime(newStarttime);
		setEndTime(newEndTime);
		console.log("drag")
	};

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		setX(timeline.toX(startTime));
	}

	return <Draggable
		handle=".dragHandle"
		axis="x"
		position={{ x: x, y: 50 }}
		onDrag={onDrag}
		onStop={onDragStopped}
	>
		<ResizableBox
			className="container"
			width={width}
			height={50}
			resizeHandles={['e', 'w']}
			onResize={onResize}
			onResizeStop={onResizeStop}
		>
			<div className="dragHandle" />

			{format(startTime, "p")}
			-
			{format(endTime, "p")}
		</ResizableBox>
	</Draggable >
}