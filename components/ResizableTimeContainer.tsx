import { EventResponse } from "types/Events"
import { SyntheticEvent, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import { TimelineUtils } from "utils/TimelineUtils";
import { addSeconds, differenceInSeconds, format, roundToNearestMinutes } from "date-fns";
import styles from "styles/Components/TimelineContainer.module.scss"
interface Props {
	event: EventResponse
	timeline: TimelineUtils
	updateHandler: (id: string, start: Date, end: Date) => void;
}

export default function ResizableTimeContainer({ event, timeline, updateHandler }: Props) {
	const cellHeight = 50;
	const [startTime, setStartTime] = useState(new Date(event.startDateTime));
	const [endTime, setEndTime] = useState(new Date(event.endDateTime));

	const startX = timeline.toX(startTime);
	const endX = timeline.toX(endTime)

	const [duration, setDuration] = useState(differenceInSeconds(endTime, startTime));
	const [width, setWidth] = useState((timeline.toX(endTime) - timeline.toX(startTime)));

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		const newSize = size.width;
		let newStartTime = startTime;
		let newEndTime = endTime;

		if (handle === 'w') {
			const tempX = startX + (width - newSize);
			newStartTime = timeline.toDate(tempX)
			setStartTime(newStartTime);
		}

		if (handle === "e") {
			newEndTime = timeline.toDate(startX + newSize)
			setEndTime(newEndTime);
		}

		setWidth(newSize);
	};

	const onResizeStop = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		const newX = timeline.toX(newStartTime)
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		setWidth(timeline.toX(newEndTime) - newX);
		updateHandler(event.id, newStartTime, newEndTime)
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		// setX(ui.x);
		const newStartTime = timeline.toDate(ui.x)
		const newEndTime = addSeconds(newStartTime, duration);
		setStartTime(newStartTime);
		setEndTime(newEndTime);
	};

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		setStartTime(roundToNearestMinutes(startTime, { nearestTo: 15 }))
		updateHandler(event.id, startTime, endTime)
	}

	//TODO change x to calculate x from start time
	//TODO change widht to calculate width from start and end time
	// both are multipled by zoom

	return <div className={styles.container}><Draggable
		handle=".dragHandle"
		axis="x"
		position={{ x: startX, y: 0 }}
		onDrag={onDrag}
		onStop={onDragStopped}
	>
		<ResizableBox
			className="container"
			width={endX - startX}
			height={cellHeight}
			resizeHandles={['e', 'w']}
			onResize={onResize}
			onResizeStop={onResizeStop}
		>
			<div className="dragHandle" >
				<div className={styles.timeContainer}>
					<div className={styles.timeCue}>{format(roundToNearestMinutes(startTime, { nearestTo: 15 }), "HH:mm")}</div>
					<div className={styles.timeCue}>{format(roundToNearestMinutes(endTime, { nearestTo: 15 }), "HH:mm")}</div>
				</div>
			</div>
		</ResizableBox>
	</Draggable >
	</div>

}