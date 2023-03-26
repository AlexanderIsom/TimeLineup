import { Event } from '../types'
import styles from '../styles/Components/EventBanner.module.scss'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  event: Event
}

export default function EventBanner({ event }: Props) {
  const [ownerUser, setOwnerUser] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reseponse = await fetch('/api/getUser?userId=' + event.userId)
        const json = await reseponse.json()
        console.log(json)
      } catch (e) {
        console.log('error', e)
      }
    }

    fetchData()
  }, [])

  return (
    <Link href={'/Events/' + event.id} className={styles.event}>
      {event.title}
    </Link>
  )
}
