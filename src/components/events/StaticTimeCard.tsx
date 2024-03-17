import Timeline from "@/utils/Timeline";
import styles from "@/styles/Components/TimelineCard.module.scss";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

interface Props {
	start: number;
	duration: number;
	eventStartDate: Date;
	username: string;
}

export default function StaticTimeCard({ start, duration, eventStartDate, username }: Props) {
	return (
		<div
			style={{ width: `${Timeline.minutesToXPosition(duration)}px`, translate: `${Timeline.minutesToXPosition(start)}px` }}
			className={`${styles.container} ${styles.content}`}
		>
			<div className={styles.timeContainer}>
				<span >{username}</span>
				{/* <span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(eventStartDate, start), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span> */}
				{/* <span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(eventStartDate, start + duration), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span> */}
			</div>
		</div>
	);
}
