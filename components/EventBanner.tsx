import { Event } from '../types'
import styles from '../styles/Components/EventBanner.module.scss'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatDateRange } from "utils/TimeUtils"

interface Props {
  event: Event
}

export default function EventBanner({ event }: Props) {
  var randomColor = Math.floor(16777215).toString(16);
  return (
    <Link href={'/Events/' + event.id} className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.colorStrip} style={{ backgroundColor: `#${randomColor}` }} />
        <div className={styles.informationContainer}>
          <div className={styles.title}>
            {event.title}
          </div>
          <div className={styles.host}>
            {event.user.name}
          </div>
          <div className={styles.time}>
            {formatDateRange(new Date(event.startDateTime), new Date(event.endDateTime))}
          </div>
        </div>
      </div>
    </Link>
  )
}
