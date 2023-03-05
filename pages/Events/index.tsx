import Header from "../../components/Header";
import clientPromise from "../../lib/mongodb";
import Image from "next/image";

export default function Events({ events }: any) {
	return (
		<>
			<Header title="Events" />
			<div>Events</div>

			{/* <div>
        {events.map((event: any) => (
          <ul key={event.id}>
            <p>{event.name}</p>
            <p>{event.start}</p>
            <p>{event.end}</p>
            <Image src={event.imageUrl} width={40} height={40} alt="" />
          </ul>
        ))}
      </div> */}
		</>
	);
}

// export async function getServerSideProps() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("Events");

//     const events = await db.collection("events").find({}).toArray();

//     return {
//       props: { events: JSON.parse(JSON.stringify(events)) },
//     };
//   } catch (e) {
//     console.error(e);
//   }
// }
