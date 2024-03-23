import styles from "@/styles/Components/Events/EventDetails.module.scss";
import { formatDateRange } from "@/utils/TimeUtils"
import { AgendaItem, EventData, ResponseState } from "@/lib/types/Events"
import React from "react";
import { addMinutes, format } from "date-fns";
import Image from "next/image"
import { Profile, Rsvp } from "@/db/schema";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EventWithRsvpAndUser } from "@/db/schemaTypes";
import { CalendarRange } from "lucide-react";

interface Props {
	localUser: Profile
	event: EventWithRsvpAndUser
	localRsvp?: Rsvp
	otherRsvp: Array<Rsvp>
	// responseState: ResponseState;
	// onStateChange: (newState: ResponseState) => void;
}

export default async function EventDetails({ event, localRsvp, otherRsvp }: Props) {
	// const declinedUsers = otherRsvp.filter((reponse) => {
	// 	return reponse.rejected === true;
	// })

	// const invitedUsers = event.userResponses.filter((reponse) => {
	// 	return reponse.state === ResponseState.pending
	// })

	// const attendingUsers = event.userResponses.filter((reponse) => {
	// 	return reponse.state === ResponseState.attending
	// })

	// var attendingCount = attendingUsers.length;
	// var invitedCount = invitedUsers.length;
	// var declinedCount = declinedUsers.length;
	// var showButtons = event.userId !== ResponseState.hosting;

	return (
		<div className={styles.container} >
			<div className={styles.heading}>
				<div className={styles.eventTitle}>
					<h1>{event.title}</h1>
				</div>
				<div className={styles.eventHostInformation}>
					<Avatar>
						<AvatarImage src={event.host.avatarUrl!} />
						<AvatarFallback>{event.host.username!.substring(0, 2)}</AvatarFallback>
					</Avatar>
					{event.host.username}
				</div>
			</div>
			<Separator />
			<div className={styles.eventDate}>
				<CalendarRange className={styles.calendarIcon} />
				{formatDateRange(new Date(event.start), event.end)}
			</div>

			<div className={styles.eventDescription}>
				<div className={styles.sectionHeading}>Description</div>
				{event.description}
			</div>
			<Separator />

			<div className={styles.agenda}>
				<div className={styles.sectionHeading}>Agenda</div>
				<div className={styles.agendaContent}>
					{/* {event.agenda.map((e: AgendaItem, index) => {
						return (
							<React.Fragment key={index}>
								<div style={{ gridRow: index + 1, gridColumn: 1 }}>{`${format(new Date(e.start), "h:mmaaa")} - ${format(new Date(e.end), "h:mmaaa")}`}</div>
								<div style={{ gridRow: index + 1, gridColumn: 3 }}>{e.description}</div>
							</React.Fragment>
						)
					})} */}
					{/* <Separator className={styles.separator} orientation={"vertical"} style={{ gridRowStart: 1, gridRowEnd: event.agenda.length + 1, gridColumn: 2 }} /> */}
					<Separator className={styles.separator} orientation={"vertical"} />
				</div>
			</div>
			<Separator />
			<div className={styles.sectionHeading}>Options</div>
			<div className={styles.sectionPadding}>
				{/* <small>Status: {ResponseState[responseState]}</small> */}
				<div className={`${styles.buttonOptions}`}>
					{/* <div className={`${styles.button} ${styles.attend}`} onClick={() => {
						// if (responseState !== ResponseState.attending) {
						// 	onStateChange(ResponseState.attending);
						// }
					}}>Attend</div>
					<div className={`${styles.button} ${styles.pending}`} onClick={() => {
						// if (responseState !== ResponseState.pending) {
						// 	onStateChange(ResponseState.pending);
						// }
					}} >Unsure</div>
					<div className={`${styles.button} ${styles.decline}`} onClick={() => {
						// if (responseState !== ResponseState.declined) {
						// 	onStateChange(ResponseState.declined);
						// }
					}} >Decline</div> */}
				</div>
			</div>

			<Separator />
			<div className={styles.invites}>
				<div className={styles.sectionHeading}>Invites</div>
				<Tabs defaultValue="attending">
					<TabsList className={styles.tabContainer}>
						<TabsTrigger className={styles.tab} value="attending">
							Attending
							{/* <small className={styles.attendingCount}>{attendingCount}</small> */}
						</TabsTrigger>
						<TabsTrigger className={styles.tab} value="tab2">
							Invited
							{/* <small className={styles.inviteCount}>{invitedCount}</small> */}
						</TabsTrigger>
						<TabsTrigger className={styles.tab} value="tab3">
							Declined
							{/* <small className={styles.declinedCount}>{declinedCount}</small> */}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="tab1">
						{/* {responseState === ResponseState.attending && <div className={styles.userItem}>
							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
							<div className={styles.userName}>Demo user</div>
						</div>
						}
						{attendingUsers.map((response, index) => {
							return <div key={response.user._id.toString()} className={styles.userItem}>
								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})} */}
					</TabsContent>
					<TabsContent value="tab2">
						{/* {responseState === ResponseState.pending && <div className={styles.userItem}>
							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
							<div className={styles.userName}>Demo user</div>
						</div>
						}
						{invitedUsers.map((response) => {
							return <div key={response.user._id.toString()} className={styles.userItem}>
								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})} */}
					</TabsContent>
					<TabsContent value="tab3">
						{/* {responseState === ResponseState.declined && <div className={styles.userItem}>
							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
							<div className={styles.userName}>Demo user</div>
						</div>
						}
						{declinedUsers.map((response) => {
							return <div key={response.user._id.toString()} className={styles.userItem}>
								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})} */}
					</TabsContent>
				</Tabs>
			</div>

		</div>
	)
}

