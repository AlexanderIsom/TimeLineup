import Header from "components/Header";
import styles from "styles/Events.module.scss";
import { EventData } from "types"
import EventCard from "components/EventCard";
import { GetServerSidePropsContext } from "next";
import { ResponseState, User } from "types/Events";
import { addDays, addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, isSameDay, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
import clientPromise from "lib/mongodb";
import { LocalDataObject } from "./[id]";
import { useEffect, useState } from "react";

interface DateRange {
  start: Date;
  end: Date;
}

type Props = {
  events: EventData[]
  users: User[]
  dateRange: DateRange;
}

export default function Home({ events, users, dateRange }: Props) {


  const startDay = new Date(dateRange.start)
  const endDay = new Date(dateRange.end)
  const days = eachDayOfInterval({ start: startDay, end: endDay })
  const today = new Date();

  const [demoEvents, setDemoEvents] = useState<EventData[]>([]);

  useEffect(() => {
    setDemoEvents(events.map((event) => {
      const localDataString = localStorage.getItem(event._id.toString())
      if (localDataString !== null) {
        const localData: LocalDataObject = JSON.parse(localDataString);
        event.status = localData.responseState !== undefined ? localData.responseState : ResponseState.pending

      } else {
        event.status = ResponseState.pending
      }

      return event;
    }));
  }, [events])

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.tools}>
          <Link href={{ pathname: "/Events", query: { start: subWeeks(startDay, 1).toDateString(), end: subWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❮</Link>
          <Link href={{ pathname: "/Events", query: { start: addWeeks(startDay, 1).toDateString(), end: addWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❯</Link>
          <Link href={{ pathname: "/Events", query: { start: startOfWeek(today).toDateString(), end: endOfWeek(today).toDateString() } }} className={styles.pagenation}>Today</Link>
          <div className={styles.weekHeader}>
            {format(startDay, "do")} - {format(endDay, "do MMMM yyyy")}
          </div>
        </div>
        <div className={styles.weekGrid}>
          {days.map((day: Date, index) => {
            return <div key={index} className={`${isSameDay(day, new Date()) ? styles.today : ""} ${styles.weekTile}`} style={{ gridColumn: index + 1 }
            }>
              <div className={styles.dayHeading}>{format(day, "ccc do")}</div>
              <div className={styles.eventList}>
                {demoEvents.filter((eventCard) => {
                  return eventCard.day === index
                }).map((filteredEvent, eIndex) => {
                  return <EventCard key={eIndex} event={filteredEvent} />
                })}
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { params, query } = context;
    var today = new Date();

    var weekStart: Date;
    var weekEnd: Date;

    if (!query || typeof query.start != "string" || typeof query.end != "string") {
      weekStart = startOfWeek(today);
      weekEnd = endOfWeek(today);
    } else {
      weekStart = startOfWeek(new Date(query.start));
      weekEnd = endOfWeek(new Date(query.end));
    }

    const weekOffset = differenceInWeeks(weekStart, startOfWeek(today))

    const client = await clientPromise
    const db = client.db("TimeLineupDemo")

    const events = await db.collection("Event").aggregate([{ $match: { weekOffset: weekOffset } }, {
      $lookup: {
        from: 'User',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    }]).toArray()

    // for demo site only
    events.forEach((obj) => {
      const day = obj.day;
      const newStartDate = addDays(weekStart, day)
      obj.startDateTime = new Date(obj.startDateTime);
      obj.startDateTime.setDate(newStartDate.getDate());
      obj.startDateTime.setMonth(newStartDate.getMonth())
      obj.startDateTime.setYear(newStartDate.getFullYear())
    })

    // const responses = await db.collection("EventResponses").find({})

    // allEvents.forEach(element => {
    //   const newDay = setDay(addWeeks(today, element.weekOffset!), element.day!)
    //   element.startDateTime.setDate(newDay.getDate())
    //   element.endDateTime.setDate(newDay.getDate())

    //   element.startDateTime.setMonth(newDay.getMonth())
    //   element.endDateTime.setMonth(newDay.getMonth())

    //   element.startDateTime.setFullYear(newDay.getFullYear())
    //   element.endDateTime.setFullYear(newDay.getFullYear())
    // });



    // const events = allEvents.filter((event) => {
    //   return isWithinInterval(event.startDateTime, { start: weekStart, end: weekEnd })
    // })

    const users = {}

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as EventData[], users: JSON.parse(JSON.stringify(users)) as User[], dateRange: JSON.parse(JSON.stringify({ start: weekStart, end: weekEnd })) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { events: [], users: [], dateRange: JSON.parse(JSON.stringify({ start: new Date(), end: addDays(new Date(), 7) })) },
    };
  }
}

