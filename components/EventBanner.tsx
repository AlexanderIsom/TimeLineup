import { EventData } from '../types'
import styles from '../styles/Components/EventBanner.module.scss'
import Link from 'next/link'
import { formatDateRange } from "utils/TimeUtils"

interface Props {
  event: EventData
}

export default function EventBanner({ event }: Props) {
  return (
    <Link href={'/Events/id/' + event.id} className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.colorStrip} style={{ backgroundColor: `${event.color}` }} />
        <div className={styles.informationContainer}>
          <div className={styles.title}>
            {event.title}
          </div>
          <div className={styles.host}>
            {event.user.name}
          </div>
          <div className={styles.time}>
            {formatDateRange(new Date(event.startTimestamp.seconds * 1000), new Date(event.endTimestamp.seconds * 1000))}
          </div>
        </div>
      </div>
    </Link>
  )
}
