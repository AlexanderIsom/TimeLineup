import { useSession, getSession } from "next-auth/react";
import { useCallback, useState } from "react";
import Calendar from "../components/Calendar";
import Header from "../components/Header";
import clientPromise from "../lib/mongodb";
import styles from "../styles/Index.module.scss";
import EventsList from "../components/EventsList";
import EventForm from "../components/NewEventForm";
import Modal from "../components/Modal";
import { Event } from "../types"
import { startOfToday } from "date-fns";
import Link from "next/link";

type propTypes = {
  events: Event[]
}

export default function Home({ events }: propTypes) {
  const { data: session } = useSession();
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  const [showModal, setShowModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const monthChanged = useCallback(() => {
  }, []);

  const selectedDayChanged = useCallback((day: Date) => {
    setSelectedEvent(undefined);
    setSelectedDay(day);
  }, []);

  if (session) {
    return (
      <>
        <Header />
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <EventForm />
        </Modal>
        <div className={styles.wrapper}>
          <div className={styles.calendarMenu}>
            <div className={styles.calendar}>
              <Calendar
                events={events}
                onMonthChanged={monthChanged}
                onSelectedDayChange={selectedDayChanged}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={styles.newEventButton}
            >
              New Event
            </button>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
              <EventForm />
            </Modal>
          </div>


          <EventsList events={events} day={selectedDay} setSelectedEvent={setSelectedEvent} />
          <div>
            <h1>{selectedEvent !== undefined ? (<div>name: {selectedEvent.name} <br />
              <Link href={"/Events/" + selectedEvent._id}>
                <button type="button" >view more details</button>
              </Link>
            </div>) : "select an event to view more information"}</h1>
          </div>

        </div>
      </>
    );
  }
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db("Events");

    const events = await db.collection("events").find({}).toArray();

    return {
      props: { session, events: JSON.parse(JSON.stringify(events)) },
    };
  } catch (e) {
    console.error(e);
  }
}
