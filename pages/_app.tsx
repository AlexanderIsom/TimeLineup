import "../styles/globals.css";
import "../styles/Components/Resizable.css";
import type { AppProps } from "next/app";
import CustomNavbar from "../components/Navbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <main style={{ display: "grid", gridTemplateRows: "64px 1fr" }}>
        <CustomNavbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}
