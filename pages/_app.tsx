import "../styles/globals.css";
import "../styles/Components/Resizable.css";
import type { AppProps } from "next/app";
import CustomNavbar from "../components/Navbar";
import { Nunito } from "@next/font/google";

const nunito = Nunito({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${nunito.style.fontFamily};
        }
      `}</style>
      <main style={{ display: "grid", gridTemplateRows: "64px 1fr" }}>
        <CustomNavbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}
