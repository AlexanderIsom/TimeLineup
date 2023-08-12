import Header from "components/Header";
import styles from "styles/Events.module.scss";
import { EventData } from "types"
import EventCard from "components/EventCard";
import { GetServerSidePropsContext } from "next";
import { User } from "types/Events";
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


  const [demoEvents, setDemoEvents] = useState<EventData[]>([]);

  useEffect(() => {
    setDemoEvents(events.map((event) => {
      const localDataString = localStorage.getItem(event._id.toString())
      if (localDataString !== null) {

        const localData: LocalDataObject = JSON.parse(localDataString);

        if (localData.rejected) {
          event.status = "rejected"
        } else {
          if (localData.schedule === undefined || (localData.schedule !== undefined && localData.schedule.length === 0)) {
            event.status = "invited"
          } else if (localData.schedule.length > 0) {
            event.status = "attending"
          }
        }

      } else {
        event.status = "invited"
      }

      return event;
    }));
  }, [events])




  // if (typeof window !== 'undefined') {
  //   debugger;
  //   events.forEach((event) => {
  //     const localDataString = localStorage.getItem(event._id.toString())
  //     if (localDataString !== null) {

  //       const localData: LocalDataObject = JSON.parse(localDataString);

  //       if (localData.rejected) {
  //         event.status = "rejected"
  //       } else {
  //         if (localData.schedule === undefined || (localData.schedule !== undefined && localData.schedule.length === 0)) {
  //           event.status = "invited"
  //         } else if (localData.schedule.length > 0) {
  //           event.status = "attending"
  //         }
  //       }

  //     } else {
  //       event.status = "invited"
  //     }
  //   })
  // }


  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.tools}>
          <Link href={{ pathname: "/Events", query: { start: subWeeks(startDay, 1).toDateString(), end: subWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❮</Link>
          <Link href={{ pathname: "/Events", query: { start: addWeeks(startDay, 1).toDateString(), end: addWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❯</Link>
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
        from: 'User', // The collection to perform the join with
        localField: 'userId', // The field from the posts collection
        foreignField: '_id', // The field from the users collection
        as: 'user' // The field where the joined document will be stored
      }
    }]).toArray()

    const responses = await db.collection("EventResponses").find({})

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

    // const users = await prisma.user.findMany();
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

