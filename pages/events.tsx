import Header from "../components/Header";
import styles from "../styles/Index.module.scss";
import { Event } from "../types"
import EventBanner from "../components/EventBanner";

import { prisma } from "../lib/db";
import { generateRandomAttendingTimes, generateEvents } from "utils/FakeData";
import { User } from "types/Events";

type Props = {
  events: Event[]
  users: User[]
}

export default function Home({ events, users }: Props) {
  // generateRandomAttendingTimes(events, users);
  // console.log(JSON.stringify(generateEvents(users)))

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        {events.map((event: Event, index: number) => {
          return <EventBanner key={index} event={event} />
        })}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: true,
      }
    });

    const users = await prisma.user.findMany();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as Event[], users: JSON.parse(JSON.stringify(users)) as User[] },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { events: [] },
    };
  }
}

