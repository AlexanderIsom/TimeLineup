import Timeline from "@/utils/Timeline";
import styles from "./TimelineCard.module.scss";
import { Schedule } from "../events/ClientCardContainer";
import { Profile } from "@/db/schema";

interface Props {
	schedule: Schedule;
	user: Profile;
}

export default function StaticTimeCard({ schedule, user }: Props) {
	return (
		<div
			style={{ width: `${Timeline.minutesToXPosition(schedule.duration)}px`, translate: `${Timeline.minutesToXPosition(schedule.start)}px` }}
			className={`${styles.container}`}
		>
			<div className={styles.timeContainer}>
				<span className={styles.timeCue}>{Timeline.formatMinutes(schedule.start)}</span>
				<span className={styles.timeCue}>{Timeline.formatMinutes(schedule.start + schedule.duration)}</span>
			</div>
		</div>
	);
}
