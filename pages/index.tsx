import { getProviders } from "next-auth/react";
import Header from "../components/Header";
import { Nunito } from "@next/font/google";

import styles from "../styles/Signin.module.scss";
import Link from "next/link";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const nunito = Nunito({ subsets: ["latin"] });

export default function SignIn({ providers }: any) {
  return (
    <>
      <Header title="Login" />
      <div className={styles.wrapper}>
        <div className={styles.background} />
        <div className={classNames(nunito.className, styles.overlay)}>
          <div className={styles.inner}>
            <h1 className={styles.title}>
              Welcome, TimeLineup
              the app making event planning around the world simpler!
            </h1>

            <p className={styles.description}>
              Ever wanted a shared calendar between your friends, allowing you
              to see when people are avaliable in order to plan events?
              <strong> Thats what TimeLineup aims to solve.</strong>
            </p>

            <div className={styles.btns}>
              <Link className={classNames(styles.btn, styles.discord)} href={"./Events"}><span>Continue here</span></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
