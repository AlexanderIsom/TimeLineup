import { Button } from "@/components/ui/button";
import styles from "@/styles/pages/Events.module.scss";
import { EventData } from "@/lib/types";
// import EventCard from "@/components/events/EventCard";
import { EventResponse, ResponseState } from "@/lib/types/Events";
import { addDays, addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, getDay, isAfter, isBefore, isEqual, isSameDay, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
// import { useEffect, useState } from "react";
import EventForm from "@/components/events/CreateEventDialog";
import { useRouter } from "next/navigation";
import { db } from "@/db";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import CreateEventDialog from "@/components/events/CreateEventDialog";
import { currentUser } from "@clerk/nextjs";
import { eq, inArray, or, sql, arrayContains } from "drizzle-orm";
import { events } from "@/db/schema"

// where: or(eq(events.userId, user.id), sql`JSON_CONTAINS(${events.invitedUsers}, ${JSON.stringify(user.id)}, '$')`)

async function getData() {
  const user = await currentUser();
  if (user === null) return [];

  const query = await db.query.events.findMany({
    where: or(eq(events.userId, user.id), arrayContains(events.invitedUsers, [user.id]))
  });

  return query as Array<EventData>;
}

export default async function Events({ searchParams }: { searchParams?: { start: string | undefined; end: string | undefined } }) {
  const userEvents = await getData();

  const startDay = searchParams?.start !== undefined ? Date.parse(searchParams!.start) : new Date();
  const endDay = searchParams?.end !== undefined ? Date.parse(searchParams!.end) : addDays(startDay, 6);
  const days = eachDayOfInterval({ start: startDay, end: endDay });

  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.tools}>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: subWeeks(startDay, 1).toDateString(),
                end: subWeeks(endDay, 1).toDateString(),
              },
            }}
          >
            <Button variant="ghost" size={"icon"}>
              <FaChevronLeft />
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: addWeeks(startDay, 1).toDateString(),
                end: addWeeks(endDay, 1).toDateString(),
              },
            }}
          >
            <Button variant="ghost" size={"icon"}>
              <FaChevronRight />
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/events",
              query: {
                start: startOfWeek(today).toDateString(),
                end: endOfWeek(today).toDateString(),
              },
            }}
          >
            <Button variant="ghost">Today</Button>
          </Link>
          <CreateEventDialog />

          <div className={styles.weekHeader}>
            {format(startDay, "do")} - {format(endDay, "do MMMM yyyy")}
          </div>
        </div> */}
      <div className={styles.dateHeader}>
        <div className={styles.datePadding} ><CreateEventDialog /></div>
        <div className={styles.dateGrid}>
          {days.map((day: Date, index) => {
            return (
              <div key={index} >
                <div className={` ${isSameDay(day, new Date()) ? styles.today : ""} ${styles.dateContainer}`}>
                  <div className={styles.halfHeightBorder} />
                  <div className={styles.date}>
                    <div className={styles.dayText}>{format(day, "ccc")}</div>
                    <div className={styles.dayNumber}>{format(day, "d")}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.weekGrid}>
          <div className={styles.time}>
            {Array.from({ length: 23 }, (_, i) => i).map((number) => (
              <div key={number + 1} className={styles.timeText}>{(number + 1).toString().padStart(2, '0')}:00</div>
            ))}
          </div>
          <div className={styles.weekContainer}>
            <div className={styles.rows}>
              {Array.from({ length: 23 }, (_, i) => i).map((number) => (
                <div className={styles.horizontalLine} key={number} ></div>
              ))}
            </div>
            <div className={styles.columns}>
              <div />
              {days.map((day: Date, index) => {
                return (
                  <div key={index} >
                    <div className={styles.eventList}>
                      {userEvents.filter((e) => { return ((isBefore(e.start, day) || isSameDay(e.start, day)) && (isAfter(e.end, day) || isSameDay(e.end, day))) }).map((e: EventData) => {
                        return <div key={e.id}><Link href={`/events/${e.id}`}>
                          {e.title}
                        </Link></div>
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}