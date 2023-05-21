import { useSession } from "next-auth/react";
import { useState } from "react";
import Header from "../components/Header";
import styles from "../styles/Index.module.scss";
import EventForm from "../components/NewEventForm";
import Modal from "../components/Modal";
import { Event } from "../types"
import { prisma } from "../lib/db";
import EventBanner from "../components/EventBanner";
import { getServerSession } from "next-auth";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { generateEvents } from "utils/GenerateData"

type Props = {
  events: Event[]
}

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
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const events = generateEvents();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) as Event[] },
    };
  } catch (e) {
    console.error(e);
  }
}

