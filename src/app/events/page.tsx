import { Button } from "@/components/ui/button";
import styles from "@/styles/pages/Events.module.scss";
import { EventData } from "@/lib/types";
import EventCard from "@/components/events/EventCard";
import { EventResponse, ResponseState, User } from "@/lib/types/Events";
import { addDays, addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, getDay, isSameDay, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
// import { useEffect, useState } from "react";
import EventForm from "@/components/events/EventForm";
import { useRouter } from "next/navigation";
import { db } from "@/db";

interface DateRange {
  start: Date;
  end: Date;
}

interface Props {
  events: EventData[];
  dateRange: DateRange;
  users: Array<User>;
}

async function getData() {
  const res = await db.query.event.findMany();
  return res;
}

interface params {
  params: {
    start: string;
    end: string;
  };
}

export default async function Events({ searchParams }: { searchParams?: { start: string | string[] | undefined; end: string | string[] | undefined } }) {
  const data = await getData();
  console.log(searchParams?.start, searchParams?.end);
  // const startDay = new Date(dateRange.start);
  // const endDay = new Date(dateRange.end);
  const startDay = new Date();
  const endDay = new Date();
  const days = eachDayOfInterval({ start: startDay, end: endDay });
  const today = new Date();

  // const [formOpen, setFormOpen] = useState(false);

  const createEvent = async () => {
    const res = await fetch("http://localhost:3000/api/addEvent", {
      method: "POST",
    });
  };

  return (
    <>
      {/* <EventForm
        isVisible={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={() => {
          router.reload();
        }}
        users={users}
      /> */}
      <div className={styles.wrapper}>
        <div className={styles.tools}>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: subWeeks(startDay, 1).toDateString(),
                end: subWeeks(endDay, 1).toDateString(),
              },
            }}
            className={styles.pagenation}
          >
            ❮
          </Link>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: addWeeks(startDay, 1).toDateString(),
                end: addWeeks(endDay, 1).toDateString(),
              },
            }}
            className={styles.pagenation}
          >
            ❯
          </Link>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: startOfWeek(today).toDateString(),
                end: endOfWeek(today).toDateString(),
              },
            }}
            className={styles.pagenation}
          >
            Today
          </Link>
          {/* <button
            className={styles.button}
            onClick={() => {
              // setFormOpen(true);
            }}
          >
            + New Event
          </button> */}
          <div className={styles.weekHeader}>
            {format(startDay, "do")} - {format(endDay, "do MMMM yyyy")}
          </div>
        </div>
        <div className={styles.weekGrid}>
          {days.map((day: Date, index) => {
            return (
              <div key={index} className={`${isSameDay(day, new Date()) ? styles.today : ""} ${styles.weekTile}`} style={{ gridColumn: index + 1 }}>
                <div className={styles.dayHeading}>{format(day, "ccc do")}</div>
                <div className={styles.eventList}>
                  {/* {demoEvents
                    .filter((eventCard) => {
                      return eventCard.day === index;
                    })
                    .map((filteredEvent, eIndex) => {
                      return <EventCard key={eIndex} event={filteredEvent} />;
                    })} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
