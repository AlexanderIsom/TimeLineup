import { getProviders } from "next-auth/react";
import Header from "../components/Header";
import styles from "../styles/welcome.module.scss";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

const getRandomHexColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const hexToRGB = (hex: string): RGBColor => {
  const bigint = parseInt(hex.slice(1), 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  return { red, green, blue };
};

const RGBToHex = (rgb: RGBColor): string => {
  const { red, green, blue } = rgb;
  return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)
    }`
}

const generateComplementaryColor = (baseColor: string): string => {
  const baseRGB = hexToRGB(baseColor);

  // Calculate complementary color by inverting each RGB component
  const complementaryRGB: RGBColor = {
    red: 255 - baseRGB.red,
    green: 255 - baseRGB.green,
    blue: 255 - baseRGB.blue,
  };

  // Convert complementary RGB color back to hex
  const complementaryColor = RGBToHex(complementaryRGB);

  return complementaryColor;
};

export default function SignIn({ providers }: any) {
  const [baseColor, setBaseColor] = useState<string>(getRandomHexColor());

  const complementaryColor = generateComplementaryColor(baseColor);

  return (
    <>
      <Header title="TimeLineup" />
      <div className={styles.wrapper}>
        <div className={styles.background} />
        <div className={styles.overlay}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>
              Welcome to <span className={styles.titleGradient}>TimeLineup</span> the website making event planning around the world simpler!
            </h1>
          </div>
          <div className={styles.descriptionArea}>

            <p className={styles.description}>
              Ever wanted a shared calendar between you and your friends letting you
              see when people are avaliable in order to plan events <small>(and one that adjusts to your timezone ?)</small>
              < span className={styles.descriptionBold}> Thats what TimeLineup aims to solve!</span>
            </p>
            <Link href={"./Events"}>
              <button className={`${styles.btn} `}>
                <span className={`${styles.btnBackground} `}>Get Started</span>
              </button>
            </Link>
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
