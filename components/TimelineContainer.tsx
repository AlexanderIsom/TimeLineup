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

export default function TimelineContainer({ event, timeline, updateHandler }: Props) {
	const cellHeight = 50;
	const [startTime, setStartTime] = useState(new Date(event.startDateTime));
	const [endTime, setEndTime] = useState(new Date(event.endDateTime));
	const [duration, setDuration] = useState(differenceInSeconds(endTime, startTime));


	const [x, setX] = useState(timeline.toX(startTime));
	const [width, setWidth] = useState(timeline.toX(endTime) - timeline.toX(startTime));

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		let newX = x;
		let newStartTime = startTime;
		let newEndTime = endTime;
		if (handle === 'w') {
			newX = x + (width - size.width);
			setX(newX);
			newStartTime = roundToNearestMinutes(timeline.toDate(newX), { nearestTo: 15 })
			setStartTime(newStartTime);
		}

		if (handle === "e") {
			newEndTime = roundToNearestMinutes(timeline.toDate(x + size.width), { nearestTo: 15 })
			setEndTime(newEndTime);
		}

		setWidth(size.width);
		setDuration(differenceInSeconds(newEndTime, newStartTime));
	};

	const onResizeStop = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		const newX = timeline.toX(startTime)
		setX(newX);
		setWidth(timeline.toX(endTime) - newX);
		updateHandler(event.id, startTime, endTime)
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		setX(ui.x);
		const newStartTime = roundToNearestMinutes(timeline.toDate(ui.x), { nearestTo: 15 })
		const newEndTime = addSeconds(newStartTime, duration);
		setStartTime(newStartTime);
		setEndTime(newEndTime);
	};

	const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
		setX(timeline.toX(startTime));
		updateHandler(event.id, startTime, endTime)
	}

	return <div className={styles.container}><Draggable
		handle=".dragHandle"
		axis="x"
		position={{ x: x, y: 0 }}
		onDrag={onDrag}
		onStop={onDragStopped}
	>
		<ResizableBox
			className="container"
			width={width}
			height={cellHeight}
			resizeHandles={['e', 'w']}
			onResize={onResize}
			onResizeStop={onResizeStop}
		>
			<div className="dragHandle" >
				<div className={styles.timeContainer}>
					<div className={styles.timeCue}>{format(startTime, "HH:mm")}</div>
					<div className={styles.timeCue}>{format(endTime, "HH:mm")}</div>
				</div>
			</div>
		</ResizableBox>
	</Draggable >
	</div>

}