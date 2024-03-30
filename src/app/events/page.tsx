import styles from "./events.module.scss";
import { EventData } from "@/lib/types";
import { addDays, eachDayOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns";
import Link from "next/link";
import { db } from "@/db";
import { eq, or, arrayOverlaps } from "drizzle-orm";
import { events } from "@/db/schema"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import EventServerDialog from "@/components/events/newEventForm/eventServerDialog";


async function getData(user: User) {

  const query = await db.query.events.findMany({
    where: or(eq(events.userId, user.id), arrayOverlaps(events.invitedUsers, [user.id]))
  });

  return query as Array<EventData>;
}

export default async function Events({ searchParams }: { searchParams?: { start: string | undefined; end: string | undefined } }) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const userEvents = await getData(data?.user);

  const startDay = searchParams?.start !== undefined ? Date.parse(searchParams!.start) : new Date();
  const endDay = searchParams?.end !== undefined ? Date.parse(searchParams!.end) : addDays(startDay, 6);
  const days = eachDayOfInterval({ start: startDay, end: endDay });

  return (
    <div className={styles.wrapper}>
      <div className={styles.dateHeader}>
        <div className={styles.datePadding} ><EventServerDialog /></div>
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