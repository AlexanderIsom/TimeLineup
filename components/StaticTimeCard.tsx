import { EventResponse } from "types/Events";
import { TimelineUtils } from 'utils/TimelineUtils'
import styles from "styles/Components/TimelineCard.module.scss"
import { format, roundToNearestMinutes } from "date-fns";

interface Props {
    event: EventResponse
    timeline: TimelineUtils
}

export default function StaticTimeCard({ event, timeline }: Props) {
    const startTime = new Date(event.startDateTime)
    const endTime = new Date(event.endDateTime)

    const startX = timeline.toX(startTime)
    const endX = timeline.toX(endTime)
    const width = endX - startX;

    return (
        <div style={{ width: `${width}px`, translate: `${timeline.toX(startTime)}px` }} className={`${styles.container} ${styles.staticContainer} ${styles.content}`} >
            <li className={styles.timeCue}>
                {format(
                    roundToNearestMinutes(startTime, { nearestTo: 15 }),
                    'HH:mm'
                )}
            </li>
            <li className={styles.timeCue}>
                {format(
                    roundToNearestMinutes(endTime, { nearestTo: 15 }),
                    'HH:mm'
                )}
            </li>
        </div>
    )
}