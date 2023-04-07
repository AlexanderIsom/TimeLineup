import { Event } from '../types'
import styles from '../styles/Components/EventBanner.module.scss'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  event: Event
}

export default function EventBanner({ event }: Props) {
  return (
    <Link href={'/Events/' + event.id} className={styles.event}>
      {event.title}
    </Link>
  )
}
