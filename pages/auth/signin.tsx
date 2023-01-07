import { signIn, getProviders } from "next-auth/react";
import Image from "next/image";
import Header from "../../components/Header";
import backgroundImage from "../../public/RubberBandits.png";

import AnimateSphereBackground from "../../components/AnimateSpheres";

import styles from "../../styles/Signin.module.scss";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function singin({ providers }: any) {
  return (
    <>
      <Header title="Login" />
      <div className={styles.wrapper}>
        <div className={styles.background} />
        <div className={styles.orbCanvas}>
          <AnimateSphereBackground />
        </div>
        <div className={styles.overlay}>
          <div className={styles.inner}>
            <h1 className={styles.title}>
              Welcome, <span className={styles.textGradient}> TimeLineup </span>
              the app making event planning around the world simpler!
            </h1>

            <p className={styles.description}>
              Ever wanted a shared calendar between your friends, allowing you
              to see when people are avaliable in order to plan events?
              <strong> Thats what TimeLineup aims to solve.</strong>
            </p>

            <div className={styles.btns}>
              <button className={classNames(styles.btn, styles.transparent)}>
                Coming soon
              </button>

              <button
                id="ColorsButton"
                className={classNames(styles.btn, styles.colors)}
              >
                <span>Randomise Colors</span>
                <span className={styles.emoji}>🎨</span>
              </button>
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
