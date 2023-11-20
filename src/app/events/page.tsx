import { Button } from "@/components/ui/button";
import styles from "@/styles/pages/Events.module.scss";
import { EventData } from "@/lib/types";
import EventCard from "@/components/events/EventCard";
import { EventResponse, ResponseState, User } from "@/lib/types/Events";
import { addDays, addWeeks, differenceInWeeks, eachDayOfInterval, endOfWeek, format, getDay, isSameDay, isWithinInterval, setDay, startOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
// import { useEffect, useState } from "react";
import EventForm from "@/components/events/CreateEventDialog";
import { useRouter } from "next/navigation";
import { db } from "@/db";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import CreateEventDialog from "@/components/events/CreateEventDialog";

interface DateRange {
  start: Date;
  end: Date;
}

async function getData() {
  const res = await db.query.event.findMany();
  return res;
}

export default async function Events({ searchParams }: { searchParams?: { start: string | undefined; end: string | undefined } }) {
  const data = await getData();
  console.log("DATA", data);

  const startDay = searchParams?.start !== undefined ? Date.parse(searchParams!.start) : startOfWeek(new Date());
  const endDay = searchParams?.end !== undefined ? Date.parse(searchParams!.end) : endOfWeek(new Date());
  const days = eachDayOfInterval({ start: startDay, end: endDay });
  const today = new Date();

  return (
    <>
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
