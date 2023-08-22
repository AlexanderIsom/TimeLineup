import { EventData } from '../types'
import styles from '../styles/Components/EventCard.module.scss'
import Link from 'next/link'
import { format, isSameDay } from 'date-fns'
import { ResponseState } from 'types/Events'

interface Props {
  event: EventData
}

export default function EventCard({ event }: Props) {
  event.startDateTime = new Date(event.startDateTime);
  event.endDateTime = new Date(event.endDateTime);

  const startDate = format(event.startDateTime, "LLL dd")
  const endDate = format(event.endDateTime, "LLL dd")

  const isDateEqual = isSameDay(event.startDateTime, event.endDateTime)

  const startTime = format(event.startDateTime, "HH:mm")
  const endTime = format(event.endDateTime, "HH:mm")

  return (
    <Link href={'/Events/' + event._id} className={`${styles.card} ${event.status === ResponseState.attending ? styles.attending : ""} ${event.status === ResponseState.pending ? styles.invited : ""} ${event.status === ResponseState.declined ? styles.rejected : ""} ${event.status === ResponseState.hosting ? styles.hosting : ""}`}>
      <div className={styles.title}>
        {event.title}
      </div>
      <div className={styles.dates}>
        <div className={styles.dateContainer}>
          <div className={styles.dateHeading}><small>starts</small></div>
          {!isDateEqual &&
            <div className={styles.time}>
              {startDate}
            </div>}
          <div className={styles.time}>
            {startTime}
          </div>
        </div>
        -
        <div className={styles.dateContainer}>
          <div className={styles.dateHeading}><small>ends</small></div>
          {!isDateEqual &&
            <div className={styles.time}>
              {endDate}
            </div>}
          <div className={styles.time}>
            {endTime}
          </div>
        </div>
      </div>

    </Link >
  )
}
