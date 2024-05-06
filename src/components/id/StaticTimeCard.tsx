import styles from "./TimelineCard.module.scss";
import { Segment } from "@/db/schema";
import { differenceInMinutes, format } from "date-fns";

interface Props {
	eventStartTime: Date;
	minuteWidth: number;
	schedule: Segment;
}

export default function StaticTimeCard({ schedule, eventStartTime, minuteWidth }: Props) {
	const duration = differenceInMinutes(schedule.end, schedule.start)
	const offset = differenceInMinutes(schedule.start, eventStartTime)

	return (
		<div
			style={{ width: duration * minuteWidth + "px", translate: offset * minuteWidth + "px" }}
			className={`${styles.container}`}
		>
			<div className={styles.timeContainer}>
				<span className={styles.timeCue}>{format(schedule.start, "HH:mm")}</span>
				<span className={styles.timeCue}>{format(schedule.end, "HH:mm")}</span>
			</div>
		</div>
	);
}
