import { EventResponse, TimePair } from "types/Events";
import { TimelineUtils } from 'utils/TimelineUtils'
import styles from "styles/Components/TimelineCard.module.scss"
import { format, roundToNearestMinutes } from "date-fns";

interface Props {
    schedule: TimePair
    timeline: TimelineUtils
}

export default function StaticTimeCard({ schedule, timeline }: Props) {
    const startTime = new Date(schedule.start)
    const endTime = new Date(schedule.end)

    const startX = timeline.toX(startTime)
    const endX = timeline.toX(endTime)
    const width = endX - startX;

    return (
        <div style={{ width: `${width}px`, translate: `${timeline.toX(startTime)}px` }} className={`${styles.container} ${styles.staticContainer} ${styles.content}`} >
            <span className={styles.timeCue}>
                {format(
                    roundToNearestMinutes(startTime, { nearestTo: 15 }),
                    'HH:mm'
                )}
            </span>
            <span className={styles.timeCue}>
                {format(
                    roundToNearestMinutes(endTime, { nearestTo: 15 }),
                    'HH:mm'
                )}
            </span>
        </div>
    )
}