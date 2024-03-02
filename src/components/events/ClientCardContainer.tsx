'use client'

import { useRef, useState } from "react"
import ResizableTimeCard from "./ResizableTimeCard"
import { nanoid } from "nanoid"
import MathUtils from "@/utils/MathUtils"
import Timeline from "@/utils/Timeline"
import { differenceInMinutes } from "date-fns"
import styles from "@/styles/Components/Events/id.module.scss"

interface Schedule {
	id: string
	start: number
	duration: number
}

interface Props {
	schedules: Array<Schedule>
	eventStartDate: Date;
	eventEndDate: Date;
}

export default function ClientCardContainer(props: Props) {
	const designSize = 1920
	const [currentZoom, setCurrentZoom] = useState(1);
	const [designWidth, setDesignWidth] = useState(designSize * currentZoom)
	const [scheduleState, setScheduleState] = useState<Schedule[]>([])
	// const [responseState, setResponseState] = useState<ResponseState>(ResponseState.pending);
	// const [showMenu, setShowMenu] = useState<menu>({ showing: false })
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const attendingUsersContainerRef = useRef<HTMLDivElement>(null);
	const [contentLastScroll, setContentLastScroll] = useState(0);
	// const [event, setEvent] = useState<EventData>(eventData)

	const eventDurationMinutes = differenceInMinutes(props.eventEndDate, props.eventStartDate)
	new Timeline(props.eventStartDate, eventDurationMinutes, designWidth, 5)

	function handleCreate(start: number, duration: number, table: Schedule[]): Schedule[] {
		// if (responseState !== ResponseState.attending) {
		// 	setResponseState(ResponseState.attending)
		// }
		const newSchedule = Array.from(table);
		newSchedule.push({ start: start, duration: duration, id: nanoid() })
		return newSchedule;
	}

	function handleDelete(idToDelete: string, table: Schedule[]): Schedule[] {
		return table.filter(r => r.id !== idToDelete);
	}

	function findOverlappingResponses(table: Array<Schedule>, offsetFromStart: number, duration: number): Array<Schedule> {
		const overlappingResponses = table.filter(item => {
			const startIsWithin = MathUtils.isBetween(item.start, offsetFromStart, offsetFromStart + duration)
			const endIsWithin = MathUtils.isBetween(item.start + duration, offsetFromStart, offsetFromStart + duration)

			if (startIsWithin || endIsWithin) {
				return true;
			}
		});
		return overlappingResponses;
	}

	function handleUpdate(id: string, offsetFromStart: number, duration: number) {
		let filteredUserResponses = scheduleState.filter(s => s.id !== id);
		// let filteredUserResponses: Array<Schedule> = [];
		const overlappingEvents = findOverlappingResponses(filteredUserResponses, offsetFromStart, duration);

		if (overlappingEvents.length > 0) {
			const startTimes = overlappingEvents.map(e => e.start)
			const endTimes = overlappingEvents.map(e => e.start + e.duration)
			startTimes.push(offsetFromStart);
			endTimes.push(offsetFromStart + duration)
			const start = Math.min(...startTimes)
			const end = Math.max(...endTimes)

			overlappingEvents.forEach(event => {
				filteredUserResponses = handleDelete(event.id, filteredUserResponses);
			});
			filteredUserResponses = handleCreate(start, end - start, filteredUserResponses)
		} else {
			filteredUserResponses.push({ id: id, start: offsetFromStart, duration: duration })
		}

		setScheduleState(filteredUserResponses);
	}

	// function onContext(e: React.MouseEvent, pairId: string) {
	// 	e.preventDefault();
	// 	setShowMenu({ x: e.clientX, y: e.clientY, showing: true, currentId: pairId })
	// }

	// function handleZoomOut() {
	// 	const newZoom = EnumX.of(ZoomLevels).previous(currentZoom)
	// 	const width = timelineScrollingContainerRef.current?.getBoundingClientRect().width !== undefined ? timelineScrollingContainerRef.current?.clientWidth : 0
	// 	setDesignWidth(Math.max(width, designSize * newZoom));
	// 	setCurrentZoom(newZoom);
	// }

	// function handleZoomIn() {
	// 	const newZoom = EnumX.of(ZoomLevels).next(currentZoom)
	// 	setDesignWidth(designSize * newZoom);
	// 	setCurrentZoom(newZoom);
	// }

	const handleDoubleClick = (e: React.MouseEvent) => {
		var bounds = timelineContainerRef.current!.getBoundingClientRect();
		const width = e.clientX - bounds.left;
		const offsetFromStart = MathUtils.roundToNearest(Timeline.xPositionToMinutes(width), 15)
		const duration = 60;

		if (findOverlappingResponses(scheduleState, offsetFromStart, duration).length === 0) {
			const newSchedule = handleCreate(offsetFromStart, duration, scheduleState)
			setScheduleState(newSchedule);
		}
	}

	const onContentScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		if (e.currentTarget.scrollTop !== contentLastScroll) {
			attendingUsersContainerRef.current!.scrollTop = e.currentTarget.scrollTop;
			setContentLastScroll(e.currentTarget.scrollTop);
		}
	}

	// const onResponseStateChange = (newState: ResponseState) => {
	// 	setResponseState(newState);

	// 	if (newState !== ResponseState.attending) {
	// 		setScheduleState([])
	// 	}
	// }

	const bounds = { start: props.eventStartDate, end: props.eventEndDate }

	// const isPropPopulated = prop.spans !== null && prop.spans !== undefined;
	return (
		<div className={styles.localUserResponses} onDoubleClick={handleDoubleClick} ref={timelineContainerRef}>
			{scheduleState.map((schedule: Schedule) => {
				return <ResizableTimeCard
					key={schedule.id}
					id={schedule.id}
					start={schedule.start}
					duration={schedule.duration}
					updateHandler={handleUpdate}
					bounds={bounds}
				/>
			})}
			{/* <ResizableTimeCard id={nanoid()} bounds={bounds} duration={60} start={60} updateHandler={handleUpdate} /> */}
		</div>
	)
}