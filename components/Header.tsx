import Head from "next/head";

export default function Header({ title }: { title?: string }) {
  return (
    <Head>
      <title>{title ? title : "TimeLineup"}</title>
      <link rel="icon" href="/favicon.svg" />
    </Head>
  );
}
