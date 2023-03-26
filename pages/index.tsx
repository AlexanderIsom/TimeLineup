import { useSession, getSession } from "next-auth/react";
import { useState } from "react";
import Header from "../components/Header";
import styles from "../styles/Index.module.scss";
import EventForm from "../components/NewEventForm";
import Modal from "../components/Modal";
import { Event } from "../types"
import { PrismaClient } from "@prisma/client";
import EventBanner from "../components/EventBanner";

type Props = {
  events: Event[]
}

const prisma = new PrismaClient();

export default function Home({ events }: Props) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  if (session) {
    return (
      <>
        <Header />
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <EventForm />
        </Modal>
        <div className={styles.wrapper}>

          {events.map((event: Event, index: number) => {
            return <EventBanner key={index} event={event} />
          })}
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
    const events = await prisma.event.findMany();

    return {
      props: { session, events: JSON.parse(JSON.stringify(events)) },
    };
  } catch (e) {
    console.error(e);
  }
}
