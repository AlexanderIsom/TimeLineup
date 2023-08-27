import { EventData } from '../types'
import styles from '../styles/Components/EventCard.module.scss'
import Link from 'next/link'
import { addMinutes, format, isSameDay } from 'date-fns'
import { ResponseState } from 'types/Events'

interface Props {
  event: EventData
}

export default function EventCard({ event }: Props) {
  const startDateTime = new Date(event.startDateTime);
  const endDateTime = addMinutes(startDateTime, event.duration);

  const startDate = format(startDateTime, "LLL dd")
  const endDate = format(endDateTime, "LLL dd")

  const isDateEqual = isSameDay(startDateTime, endDateTime)

  const startTime = format(startDateTime, "HH:mm")
  const endTime = format(endDateTime, "HH:mm")

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
