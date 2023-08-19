import { EventResponse, TimeDuration } from "types/Events";
import { TimelineUtils } from 'utils/TimelineUtils'
import styles from "styles/Components/TimelineCard.module.scss"
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

interface Props {
    schedule: TimeDuration
    timeline: TimelineUtils
}

export default function StaticTimeCard({ schedule, timeline }: Props) {
    const startTime = new Date(schedule.start)
    const width = timeline.widthFromMinutes(schedule.duration);

    return (
        <div style={{ width: `${width}px`, translate: `${timeline.toX(startTime)}px` }} className={`${styles.container} ${styles.content}`} >
            <div className={styles.timeContainer}>
                <span className={styles.timeCue}>
                    {format(
                        roundToNearestMinutes(startTime, { nearestTo: 15 }),
                        'HH:mm'
                    )}
                </span>
                <span className={styles.timeCue}>
                    {format(
                        addMinutes(startTime, schedule.duration),
                        'HH:mm'
                    )}
                </span>
            </div>

        </div>
    )
}