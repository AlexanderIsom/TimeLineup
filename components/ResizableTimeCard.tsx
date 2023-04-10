import { EventResponse } from 'types/Events'
import { SyntheticEvent, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { TimelineUtils } from 'utils/TimelineUtils'
import {
	addSeconds,
	differenceInSeconds,
	format,
	roundToNearestMinutes,
} from 'date-fns'
import styles from 'styles/Components/TimelineCard.module.scss'
import { TbTrashXFilled } from "react-icons/tb"
import { useRouter } from 'next/router'
interface Props {
	event: EventResponse
	timeline: TimelineUtils
	updateHandler: (id: string, start: Date, end: Date) => void
}

export default function ResizableTimeCard({
	event,
	timeline,
	updateHandler,
}: Props) {
	const [startTime, setStartTime] = useState(new Date(event.startDateTime))
	const [endTime, setEndTime] = useState(new Date(event.endDateTime))
	const [showTools, setShowTools] = useState(false);
	const router = useRouter();

	const startX = timeline.toX(startTime)
	const endX = timeline.toX(endTime)

	const [duration, setDuration] = useState(
		differenceInSeconds(endTime, startTime)
	)

	const onResize = (e: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => {
		const newSize = size.width

		if (handle === 'w') {
			setStartTime(timeline.toDate(startX + (endX - startX - newSize)))
		}

		if (handle === 'e') {
			setEndTime(timeline.toDate(startX + newSize))
		}
	}

	const onResizeStop = () => {
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(newEndTime)
		setDuration(differenceInSeconds(newEndTime, newStartTime))
		updateHandler(event.id, newStartTime, newEndTime)
	}

	const onDrag = (e: DraggableEvent, ui: DraggableData) => {
		const newStartTime = timeline.toDate(ui.x)
		const newEndTime = addSeconds(newStartTime, duration)
		setStartTime(newStartTime)
		setEndTime(newEndTime)
	}

	const onDragStopped = () => {
		const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
		setStartTime(newStartTime)
		setEndTime(addSeconds(newStartTime, duration))
		updateHandler(event.id, startTime, endTime)
	}

	function handleMouseEnter() {
		setShowTools(true)
	}
	function handleMouseExit() {
		setShowTools(false);
	}

	async function handleDelete() {
		try {
			let response = await fetch("http://localhost:3000/api/deleteEventResponse", {
				method: "POST",
				body: JSON.stringify({
					event
				}),
				headers: {
					Accept: "application/json, text/plaion, */*",
					"Content-Type": "application/json",
				},
			});
			response = await response.json();
			console.log(response);
			if (response.status === 200) {
				router.reload();
			}
		} catch (errorMessage: any) {
			console.log(errorMessage);
		}
	}

	return (
		<Draggable
			handle='.dragHandle'
			axis='x'
			position={{ x: startX, y: 0 }}
			onDrag={onDrag}
			onStop={onDragStopped}
		>
			<Resizable
				className={styles.container}
				width={endX - startX}
				height={0}
				resizeHandles={['e', 'w']}
				onResize={onResize}
				onResizeStop={onResizeStop}
			>
				<div style={{ width: `${endX - startX}px` }} className={styles.content} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}>
					<div className={`dragHandle ${styles.timeContainer}`} >
						<li className={styles.timeCue}>
							{format(
								roundToNearestMinutes(startTime, { nearestTo: 15 }),
								'HH:mm'
							)}
						</li>
						{showTools && <div className={styles.deleteButton} onClick={handleDelete}><TbTrashXFilled className={styles.binIcon} /></div>}
						<li className={styles.timeCue}>
							{format(
								roundToNearestMinutes(endTime, { nearestTo: 15 }),
								'HH:mm'
							)}
						</li>
					</div>
				</div>
			</Resizable>
		</Draggable >
	)
}
