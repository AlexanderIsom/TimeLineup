import Header from "components/Header";
import styles from "styles/Events.module.scss";
import { Event } from "types"
import EventBanner from "components/EventBanner";
import { GetServerSidePropsContext } from "next";

import { prisma } from "lib/db";
// import { generateRandomAttendingTimes, generateEvents } from "utils/FakeData";
import { User } from "types/Events";
import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
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

  // const days = eachDayOfInterval({ start: startDay, end: endDay })
  const days: Date[] = []

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.tools}>
          <Link href={"/Events/" + subWeeks(startDay, 2)} className={styles.next}>previous</Link>
          <Link href={"/Events/" + addWeeks(startDay, 1)} className={styles.previous}>next</Link>
        </div>
        <div className={styles.weekGrid}>
          {days.map((day: Date, index) => {
            return <div key={index}>{format(day, "E do")}</div>
          })}
        </div>
        {events.map((event: Event, index: number) => {
          return <EventBanner key={index} event={event} />
        })}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { params } = context;
    console.log("params:" + params);
    const events = await prisma.event.findMany({
      include: {
        user: true,
      }
    });

    var today = new Date();

    var weekStart;
    var weekEnd;

    if (!params) {
      weekStart = startOfWeek(today);
      weekEnd = endOfWeek(today);
    } else {
      console.log("start:" + params.start)
    }


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

