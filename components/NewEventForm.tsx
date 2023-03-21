import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EventForm() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name && startDateTime) {
      try {
        let response = await fetch("http://localhost:3000/api/addEvent", {
          method: "POST",
          body: JSON.stringify({
            ownerId: session?.user.id,
            name: name,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
          }),
          headers: {
            Accept: "application/json, text/plaion, */*",
            "Content-Type": "application/json",
          },
        });
        response = await response.json();
        setName("");
        setStartDateTime(new Date().toISOString());
      } catch (errorMessage: any) {
        console.log(errorMessage);
        setError(errorMessage);
      }
    } else {
      return setError("All fields are required");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} method="post">
        <label>
          Event name:
          <input
            type="text"
            name="eventName"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <ul />

        <label>
          Start Date and time:
          <input
            type="datetime-local"
            name="eventDate"
            onChange={(e) => setStartDateTime(new Date(e.target.value).toISOString())}
          />
        </label>
        <ul />
        <label>
          End Date and time:
          <input
            type="datetime-local"
            name="eventDate"
            onChange={(e) => setEndDateTime(new Date(e.target.value).toISOString())}
          />
        </label>
        <ul />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
