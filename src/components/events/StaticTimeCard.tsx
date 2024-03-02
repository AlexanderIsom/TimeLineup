import { TimeDuration } from "@/lib/types/Events";
import Timeline from "@/utils/Timeline";
import styles from "@/styles/Components/TimelineCard.module.scss";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

interface Props {
	start: number;
	duration: number;
}

export default function StaticTimeCard({ start, duration }: Props) {
	const startTime = addMinutes(start, duration);

	return (
		<div
			style={{ width: `${Timeline.minutesToXPosition(duration)}px`, translate: `${Timeline.minutesToXPosition(start)}px` }}
			className={`${styles.container} ${styles.content}`}
		>
			<div className={styles.timeContainer}>
				<span className={styles.timeCue}>{format(roundToNearestMinutes(startTime, { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span>
				<span className={styles.timeCue}>{format(addMinutes(startTime, duration), "HH:mm")}</span>
			</div>
		</div>
	);
}
