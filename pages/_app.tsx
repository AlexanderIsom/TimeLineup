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
        <CustomNavbar />

        <main>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
}
