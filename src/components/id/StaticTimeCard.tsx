import Timeline from "@/utils/Timeline";
import styles from "./TimelineCard.module.scss";
import { Segment } from "@/db/schema";
import { differenceInMinutes, format } from "date-fns";

interface Props {
	schedule: Segment;
}

export default function StaticTimeCard({ schedule }: Props) {
	const duration = differenceInMinutes(schedule.end, schedule.start)

	return (
		<div
			style={{ width: `${Timeline.minutesToX(duration)}px`, translate: `${Timeline.dateToX(schedule.start)}px` }}
			className={`${styles.container}`}
		>
			<div className={styles.timeContainer}>
				<span className={styles.timeCue}>{format(schedule.start, "HH:mm")}</span>
				<span className={styles.timeCue}>{format(schedule.end, "HH:mm")}</span>
			</div>
		</div>
	);
}
