import { useSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import { EventResponse } from "../types/Events"
import styles from "../styles/Components/EventResponse.module.scss"

interface Props {
	event: EventResponse;
	timeline: any;
	index: number;
}

const style = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "solid 1px #ddd",
	background: "#f0f0f0"
};

export default function TimelineContainer({ event, timeline, index }: Props) {
	const resizeEnabled = { top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }
	const resizeDisabled = { top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }
	const { data: session } = useSession();
	const isSessionUser = event.userId === session?.user.id;
	const data = timeline.getWidthAndStartPosition(event.startDateTime, event.endDateTime);
	const yMultiplier = isSessionUser ? 0 : index;
	const [startX, setStartX] = useState(0);
	const [startW, setStartW] = useState("0");
	const width = timeline.width;

	useEffect(() => {
		const data = timeline.getWidthAndStartPosition(event.startDateTime, event.endDateTime);
		setStartX(data.x);
		setStartW(data.width);
	}, [timeline, event.startDateTime, event.endDateTime])

	return <Rnd
		className={styles.eventResponse}
		position={{ x: startX, y: yMultiplier * 50 }}
		size={{ width: startW, height: 50 }}
		dragAxis={"x"}
		disableDragging={!isSessionUser}
		enableResizing={isSessionUser ? resizeEnabled : resizeDisabled}
		onDragStop={(e, d) => {
			setStartX(d.x);
		}}
		onResizeStop={(e, direction, ref, delta, position) => {
			setStartW(ref.style.width);
			setStartX(position.x);
		}}
	// resizeGrid={[25, 0]}
	// dragGrid={[25, 0]}
	>

		hello
	</Rnd>
}