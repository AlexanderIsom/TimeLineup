import { EventData } from '../types'
import styles from '../styles/Components/EventCard.module.scss'
import Link from 'next/link'
import { addMinutes, format, isSameDay } from 'date-fns'
import { ResponseState } from 'types/Events'
import { useState } from 'react'
import { useHover, useFloating, useInteractions, offset, flip, shift } from '@floating-ui/react';
import Image from "next/image"
interface Props {
  event: EventData
}

export default function EventCard({ event }: Props) {
  var localResponse = event.eventResponse.find(r => r.userId === "demouser")?.state
  var query = {}
  if (event.user._id === "demouser") {
    localResponse = ResponseState.hosting;
    query = { localLoad: true }
  }
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [offset(10), flip(), shift()]
  })

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
  ]);

  const startDateTime = new Date(event.startDateTime);
  const endDateTime = addMinutes(startDateTime, event.duration);

  const startDate = format(startDateTime, "LLL dd")
  const endDate = format(endDateTime, "LLL dd")

  const isDateEqual = isSameDay(startDateTime, endDateTime)

  const startTime = format(startDateTime, "HH:mm")
  const endTime = format(endDateTime, "HH:mm")

  return (
    <>
      <Link ref={refs.setReference} {...getReferenceProps()} href={{ pathname: `/Events/${event._id}`, query: query }} className={`${styles.card} ${localResponse === ResponseState.attending ? styles.attending : ""} ${localResponse === ResponseState.pending ? styles.invited : ""} ${localResponse === ResponseState.declined ? styles.rejected : ""} ${localResponse === ResponseState.hosting ? styles.hosting : ""}`}>
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

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={`${styles.popover}`}
        >

          <div className={styles.popoverHost}>
            <Image className={styles.avatarRoot} src={`/UserIcons/${event.user.image}.png`} alt={"Demo user"} width={500} height={500} />
            <div className={styles.popoverHostName}>
              <small className={styles.popoverHostText}>Host</small>
              <p className={styles.popoverHostNameText}>{event.user.name}</p>
            </div>
          </div>
          <div className={styles.popoverDescription}>
            <small className={styles.popoverDescriptionText}>{event.description}</small>
          </div>
          <div className={styles.popoverAttendingInfo}>
            <div className={styles.popoverAttending} >
              <small className={styles.popoverCountHeading} >Attending</small>
              {event.eventResponse.filter(r => r.state === ResponseState.attending).length}
            </div>
            <div className={styles.popoverPending}> <small className={styles.popoverCountHeading} >Pending</small>
              {event.eventResponse.filter(r => r.state === ResponseState.pending).length}</div>
          </div>
          <div className={`${styles.popoverStatus}`}>
            {localResponse === ResponseState.attending && "you are attending"}
            {localResponse === ResponseState.pending && "you are invited"}
            {localResponse === ResponseState.declined && "you have declined"}
            {localResponse === ResponseState.hosting && "you are hosting"}
          </div>

        </div>
      )}
    </>
  )
}
