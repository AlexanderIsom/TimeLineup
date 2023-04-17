import "../styles/globals.css";
import "../styles/Components/Resizable.css";
import type { AppProps } from "next/app";
import CustomNavbar from "../components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>

        <main style={{ display: "grid", gridTemplateRows: "64px 1fr" }}>
          <CustomNavbar />
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
}
