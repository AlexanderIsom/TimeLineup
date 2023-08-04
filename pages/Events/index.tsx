import Header from "components/Header";
import styles from "styles/Events.module.scss";
import { EventData } from "types"
import { db } from "firestore";
import { collection, getDocs, query as firestoreQuery, where } from "firebase/firestore";
import EventBanner from "components/EventBanner";
import { GetServerSidePropsContext } from "next";
import { User } from "types/Events";
import { addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";

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
    const events: EventData[] = [];

    const q = firestoreQuery(collection(db, "event"), where("weekOffset", "==", weekOffset.toString()));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const newData = doc.data() as EventData;
      newData.id = doc.id;
      events.push(newData);
    });

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
      props: { events: [] },
    };
  }
}

