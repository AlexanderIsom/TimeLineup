import Timeline from "@/utils/Timeline";
import styles from "./TimelineCard.module.scss";
import { Schedule } from "@/db/schema";
import { differenceInMinutes } from "date-fns";

interface Props {
	schedule: Schedule;
	eventStartDate: Date
}

export default function StaticTimeCard({ schedule, eventStartDate }: Props) {
	const start = differenceInMinutes(schedule.start, eventStartDate)
	console.log(start)

	return (
		<div
			style={{ width: `${Timeline.minutesToXPosition(schedule.duration)}px`, translate: `${Timeline.minutesToXPosition(start)}px` }}
			className={`${styles.container}`}
		>
			<div className={styles.timeContainer}>
				<span className={styles.timeCue}>{Timeline.formatMinutes(start)}</span>
				<span className={styles.timeCue}>{Timeline.formatMinutes(start + schedule.duration)}</span>
			</div>
		</div>
	);
}
