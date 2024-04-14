import styles from "@/styles/Components/Events/id.module.scss"
import React from "react";
import StaticTimeCard from "@/components/events/StaticTimeCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import assert from "assert";
import ScrollableContainer from "@/components/id/ScrollableContainer";
import EventDetails from "@/components/id/EventDetails";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/profileActions";
import { GetEventData } from "@/actions/eventActions";
import { User } from "lucide-react";
import Timeline from "@/utils/Timeline";

export default async function ViewEvent({ params }: { params: { id: string } }) {
	const localUser = await getUserProfile()

	if (localUser === undefined) {
		redirect("/");
	}

	const eventData = await GetEventData(params.id);
	assert(eventData !== undefined, "Event data returned undefined")

	const localRsvp = eventData.rsvps.find(r => r.userId === localUser.id)
	const otherRsvp = eventData.rsvps.filter(r => r.userId !== localUser.id)

	otherRsvp.sort((a, b) => {
		return (a.user.username ?? "").localeCompare(b.user.username ?? "")
	})

	new Timeline(eventData.start, eventData.end, 5)

	return (
		<div className={styles.wrapper}>
			<div className={styles.scrollable}>
				<div className={styles.userContainer}>
					<div className={styles.userItem}>
						<Avatar>
							<AvatarImage src={localUser.avatarUrl!} />
							<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
						</Avatar>
						<div className={styles.userName}>{localUser.username}</div>
					</div>

					{otherRsvp.map((rsvp) => {
						return <div key={rsvp.id} className={styles.userItem}>
							<Avatar>
								<AvatarImage src={rsvp.user.avatarUrl ?? undefined} />
								<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
							</Avatar>
							<div className={styles.userName}>{rsvp.user.username ?? "user"}</div>
						</div>
					})}
				</div>
				<ScrollableContainer localRSVP={localRsvp} eventData={eventData}>
					<div className={styles.userResponses}>
						{otherRsvp.map((value, index: number) => {
							return <div key={index} className={styles.staticRow}>{
								value.schedules.map((schedule) => {
									return <StaticTimeCard key={schedule.id} schedule={schedule} user={value.user} />
								})
							}</div>
						})}
					</div>
				</ScrollableContainer>
			</div>
			<EventDetails event={eventData} localUser={localUser} />
		</div>
	)

}