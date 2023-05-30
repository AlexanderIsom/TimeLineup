import Header from "../components/Header";
import styles from "../styles/Index.module.scss";
import { Event } from "../types"
import EventBanner from "../components/EventBanner";

import { prisma } from "../lib/db";
import { generateEvents } from "utils/FakeData";

type Props = {
  events: Event[]
}

export default function Home({ events }: Props) {
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

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as Event[] },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { events: [] },
    };
  }
}

