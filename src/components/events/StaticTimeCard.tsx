import { TimeDuration } from "types/Events";
import Timeline from "utils/Timeline";
import styles from "styles/Components/TimelineCard.module.scss";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

interface Props {
  startDateTime: Date;
  schedule: TimeDuration;
}

export default function StaticTimeCard({ startDateTime, schedule }: Props) {
  const startTime = addMinutes(startDateTime, schedule.offsetFromStart);

  return (
    <div
      style={{ width: `${Timeline.minutesToXPosition(schedule.duration)}px`, translate: `${Timeline.minutesToXPosition(schedule.offsetFromStart)}px` }}
      className={`${styles.container} ${styles.content}`}
    >
      <div className={styles.timeContainer}>
        <span className={styles.timeCue}>{format(roundToNearestMinutes(startTime, { nearestTo: Timeline.getSnapToNearestMinutes() }), "HH:mm")}</span>
        <span className={styles.timeCue}>{format(addMinutes(startTime, schedule.duration), "HH:mm")}</span>
      </div>
    </div>
  );
}
