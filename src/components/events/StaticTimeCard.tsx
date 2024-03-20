import Timeline from "@/utils/Timeline";
import styles from "@/styles/Components/TimelineCard.module.scss";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import { Schedule } from "./ClientCardContainer";
import { Profile } from "@/db/schema";

interface Props {
	schedule: Schedule;
	user: Profile;
}

export default function StaticTimeCard({ schedule, user }: Props) {
	return (
		<div
			style={{ width: `${Timeline.minutesToXPosition(schedule.duration)}px`, translate: `${Timeline.minutesToXPosition(schedule.start)}px` }}
			className={`${styles.container} ${styles.content}`}
		>
			<div className={styles.timeContainer}>
				<span >{user.username}</span>
				{/* <span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(eventStartDate, start), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span> */}
				{/* <span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(eventStartDate, start + duration), { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span> */}
			</div>
		</div>
	);
}
