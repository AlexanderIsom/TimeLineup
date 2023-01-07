import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";

import styles from "../styles/Index.module.scss";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={classNames(styles.eventListContainer)}>
              Upcoming Events
            </div>
            <div className={classNames(styles.eventListContainer)}>
              hosting events
            </div>
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

  return {
    props: { session },
  };
}
