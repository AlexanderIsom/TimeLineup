import Header from "components/Header";
import styles from "styles/Components/Events.module.scss";
import { EventData } from "types"
import EventCard from "components/EventCard";
import { GetServerSidePropsContext } from "next";
import { EventResponse, ResponseState, User } from "types/Events";
import { addDays, addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, getDay, isSameDay, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
import clientPromise from "lib/mongodb";
import { useEffect, useState } from "react";
import EventForm from "components/EventForm";

interface DateRange {
  start: Date;
  end: Date;
}

type Props = {
  events: EventData[]
  dateRange: DateRange;
  users: Array<User>
}

export default function Events({ events, dateRange, users }: Props) {
  const startDay = new Date(dateRange.start)
  const endDay = new Date(dateRange.end)
  const days = eachDayOfInterval({ start: startDay, end: endDay })
  const today = new Date();

  const [demoEvents, setDemoEvents] = useState<EventData[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const localEventsString = localStorage.getItem("events");

    if (localEventsString !== null) {
      const localEvents: Array<EventData> = JSON.parse(localEventsString);
      const filtered = localEvents.filter(e => isWithinInterval(new Date(e.startDateTime), { start: startDay, end: endDay }))
      filtered.forEach(loadedEvent => {
        const dayOffset = getDay(new Date(loadedEvent.startDateTime))
        loadedEvent.day = dayOffset;
        events.push(loadedEvent)
      });
    }

    const demoEvents = events.map((event) => {
      const localDataString = localStorage.getItem(event._id)

      const localUserResponse: EventResponse = {
        id: event._id + "demo",
        eventId: event._id,
        userId: "demouser",
        schedule: [],
        state: 1,
        user: {
          _id: "demouser",
          name: "demouser",
          emailVerified: new Date(),
          image: "demo",
        }
      }

      if (localDataString !== null) {
        const localData: EventResponse = JSON.parse(localDataString);
        if (localData.state !== undefined) {
          localUserResponse.state = localData.state
        }
      }

      event.eventResponse.push(localUserResponse);
      return event;
    })
    setDemoEvents(demoEvents);

  }, [events])

  return (
    <>
      <EventForm
        isVisible={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={() => {
          // reload page
        }}
        users={users}
      />
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.tools}>
          <Link href={{ pathname: "/Events", query: { start: subWeeks(startDay, 1).toDateString(), end: subWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❮</Link>
          <Link href={{ pathname: "/Events", query: { start: addWeeks(startDay, 1).toDateString(), end: addWeeks(endDay, 1).toDateString() } }} className={styles.pagenation}>❯</Link>
          <Link href={{ pathname: "/Events", query: { start: startOfWeek(today).toDateString(), end: endOfWeek(today).toDateString() } }} className={styles.pagenation}>Today</Link>
          <button className={styles.button} onClick={() => { setFormOpen(true) }}>+ New Event</button>
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
      },
    }, { $unwind: "$user" }
      , {
      $lookup: {
        from: 'EventResponse',
        localField: '_id',
        foreignField: 'eventId',
        as: 'eventResponse'
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

    const users = await db.collection("User").find({}).toArray();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as EventData[], dateRange: JSON.parse(JSON.stringify({ start: weekStart, end: weekEnd })), users: JSON.parse(JSON.stringify(users)) as Array<User> },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { events: [], dateRange: JSON.parse(JSON.stringify({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) })) },
    };
  }
}

