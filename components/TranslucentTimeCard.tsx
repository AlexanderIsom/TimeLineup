import { add, sub } from "date-fns";
import { RefObject, useEffect, useState } from "react"
import { TimelineUtils } from "utils/TimelineUtils";
import styles from "styles/Components/TimelineCard.module.scss"

interface props {
	container: RefObject<HTMLDivElement>;
	scrollingContainer: RefObject<HTMLDivElement>;
	timeline: TimelineUtils;
	createHandler: (start: Date, end: Date) => void
}

export default function TranslucentTimeCard({ container, scrollingContainer, timeline, createHandler }: props) {
	const [mouseX, setClientX] = useState(0);
	const [times, setTimes] = useState({ startTime: new Date(), endTime: add(new Date(), { minutes: 30 }) })
	const [startX, setStartX] = useState(0);
	const [endX, setEndX] = useState(0);

	useEffect(() => {
		const containerElement = container?.current;
		const scrollingElement = scrollingContainer?.current;
		if (!containerElement || !scrollingElement)
			return

		function updateX() {
			var bounds = containerElement!.getBoundingClientRect();
			const newX = mouseX - bounds.left;
			const time = timeline.toDate(newX);
			setTimes({ startTime: sub(time, { minutes: 15 }), endTime: add(time, { minutes: 15 }) })
			setStartX(timeline.toX(times.startTime))
			setEndX(timeline.toX(times.endTime))
		}

		function handleMouseMove(e: MouseEvent) {
			setClientX(e.clientX);
			updateX();
		}

		containerElement.addEventListener("mousemove", handleMouseMove);
		scrollingElement.addEventListener("scroll", updateX);
		return () => {
			containerElement.removeEventListener("mousemove", handleMouseMove)
			scrollingElement.removeEventListener("scroll", updateX);
		}
	}, [container, mouseX, scrollingContainer, timeline, times])

	function handleOnClick() {
		createHandler(times.startTime, times.endTime)
	}

	return (
		<div style={{ translate: `${startX}px`, width: `${endX - startX}px` }} className={`${styles.newCard} ${styles.content} ${styles.container}`} onClick={handleOnClick}>+</div>
	)
}