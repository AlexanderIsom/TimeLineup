import Header from "components/Header";
import styles from "styles/Events.module.scss";
import { Event } from "types"
import EventBanner from "components/EventBanner";
import { GetServerSidePropsContext } from "next";

import { prisma } from "lib/db";
// import { generateRandomAttendingTimes, generateEvents } from "utils/FakeData";
import { User } from "types/Events";
import { addWeeks, eachDayOfInterval, endOfWeek, format, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";

interface DateRange {
  start: Date;
  end: Date;
}

type Props = {
  events: Event[]
  users: User[]
  dateRange: DateRange;
}

export default function Home({ events, users, dateRange }: Props) {
  // generateRandomAttendingTimes(events, users);
  // console.log(JSON.stringify(generateEvents(users)))

  const startDay = new Date(dateRange.start)
  const endDay = new Date(dateRange.end)

  const days = eachDayOfInterval({ start: startDay, end: endDay })

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
            return <div key={index} className={styles.weekTile} style={{ gridColumn: index + 1 }}>
              <div className={styles.dayHeading}>{format(day, "cccc do")}</div>
              <div className={styles.eventList}>
                {events.filter((eventCard) => {
                  return eventCard.day === index
                }).map((filteredEvent, eIndex) => {
                  return <EventBanner key={eIndex} event={filteredEvent} />
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
    const allEvents = await prisma.event.findMany({
      include: {
        user: true,
      }
    });

    var today = new Date();

    allEvents.forEach(element => {
      const newDay = setDay(addWeeks(today, element.weekOffset!), element.day!)
      element.startDateTime.setDate(newDay.getDate())
      element.endDateTime.setDate(newDay.getDate())

      element.startDateTime.setMonth(newDay.getMonth())
      element.endDateTime.setMonth(newDay.getMonth())

      element.startDateTime.setFullYear(newDay.getFullYear())
      element.endDateTime.setFullYear(newDay.getFullYear())
    });

    var weekStart: Date;
    var weekEnd: Date;

    if (!query || typeof query.start != "string" || typeof query.end != "string") {
      weekStart = startOfWeek(today);
      weekEnd = endOfWeek(today);
    } else {
      weekStart = startOfWeek(new Date(query.start));
      weekEnd = endOfWeek(new Date(query.end));
    }

    const events = allEvents.filter((event) => {
      return isWithinInterval(event.startDateTime, { start: weekStart, end: weekEnd })
    })

    const users = await prisma.user.findMany();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as Event[], users: JSON.parse(JSON.stringify(users)) as User[], dateRange: JSON.parse(JSON.stringify({ start: weekStart, end: weekEnd })) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { events: [] },
    };
  }
}

