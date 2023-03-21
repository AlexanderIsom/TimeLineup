import Header from "../../components/Header";
import clientPromise from "../../lib/mongodb";
import Image from "next/image";

export default function Events({ events }: any) {
  return (
    <>
      <Header title="Events" />
      <div>Events</div>
    </>
  );
}


