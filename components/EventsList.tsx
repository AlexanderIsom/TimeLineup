import Image from "next/image";
import styles from "../styles/Components/EventsList.module.scss";
import { Event } from "../types"
interface Props {
  events: Event[];
  displayAll?: Boolean;
  day: Date;
  setSelectedEvent: (event: Event) => void;
}

import { format, formatISO, parseISO } from "date-fns";

export default function EventsList({ events, displayAll, day, setSelectedEvent }: Props) {
  const formattedDay = format(day, "yyyy-MM-dd");

  const filteredEvents = events.filter(
    (event) =>
      formatISO(parseISO(event.startDateTime), { representation: "date" }) ==
      formattedDay
  );

  return (
    <>
      <section className={styles.mettingsSection}>
        <h2>
          Schedule for <time>{format(day, "EEEE do").toString()}</time>
        </h2>
        <ol className={styles.meetingOL}>
          {filteredEvents.length === 0 ? (
            <p>no events scheduled</p>
          ) : (
            filteredEvents.map((event: Event) => (
              <li key={event.id} className={styles.meetingLI} onClick={() => {
                setSelectedEvent(event);
              }}>
                {/* <Image
                  src={event.imageUrl}
                  width={40}
                  height={40}
                  alt=""
                  className={styles.meetingImage}
                /> */}
                <div className={styles.meetingInfo}>
                  <p>{event.title}</p>
                  <p>
                    <time dateTime={event.startDateTime}>start</time>-
                    <time dateTime={event.endDateTime}>end</time>
                  </p>
                </div>
              </li>
            ))
          )}
        </ol>
      </section>
    </>
  );
}
