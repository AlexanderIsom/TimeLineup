import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function EventResponseForm() {
	const { data: session } = useSession();
	const router = useRouter();

	const [startDateTime, setStartDateTime] = useState("");
	const [endDateTime, setEndDateTime] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (startDateTime && endDateTime) {
			try {
				let response = await fetch("http://localhost:3000/api/addEventResponse", {
					method: "POST",
					body: JSON.stringify({
						eventId: router.query.id,
						userId: session?.user.id,
						startDateTime: startDateTime,
						endDateTime: endDateTime,
					}),
					headers: {
						Accept: "application/json, text/plaion, */*",
						"Content-Type": "application/json",
					},
				});
				response = await response.json();
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
