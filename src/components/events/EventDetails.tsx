// import styles from "styles/Components/EventDetails.module.scss"
// import { formatDateRange } from "utils/TimeUtils"
// import { BsCalendar4Week } from "react-icons/bs"
// import * as Tabs from "@radix-ui/react-tabs"
// import * as Separator from "@radix-ui/react-separator"
// import { AgendaItem, EventData, ResponseState } from "types/Events"
// import React from "react";
// import { addMinutes, format } from "date-fns";
// import Image from "next/image"

// interface Props {
// 	event: EventData
// 	responseState: ResponseState;
// 	onStateChange: (newState: ResponseState) => void;
// }

// export default function EventDetails({ event, responseState, onStateChange }: Props) {
// 	const declinedUsers = event.userResponses.filter((reponse) => {
// 		return reponse.state === ResponseState.declined;
// 	})

// 	const invitedUsers = event.userResponses.filter((reponse) => {
// 		return reponse.state === ResponseState.pending
// 	})

// 	const attendingUsers = event.userResponses.filter((reponse) => {
// 		return reponse.state === ResponseState.attending
// 	})

// 	var attendingCount = attendingUsers.length;
// 	var invitedCount = invitedUsers.length;
// 	var declinedCount = declinedUsers.length;
// 	var showButtons = responseState !== ResponseState.hosting;

// 	switch (responseState) {
// 		case ResponseState.attending:
// 			attendingCount += 1;
// 			break;
// 		case ResponseState.pending:
// 			invitedCount += 1;
// 			break;
// 		case ResponseState.declined:
// 			declinedCount += 1;
// 			break;
// 	}

// 	return (
// 		<div className={styles.container} >
// 			<div className={styles.heading}>
// 				<div className={styles.eventTitle}>
// 					<h1>{event.title}</h1>
// 				</div>
// 				<div className={styles.eventHostInformation}>
// 					<Image className={styles.avatarRoot} src={`/UserIcons/${event.user.image}.png`} alt={"Demo user"} width={500} height={500} />
// 					{event.user.name}
// 				</div>
// 			</div>
// 			<Separator.Root className={styles.separator} />
// 			<div className={styles.eventDate}>
// 				<BsCalendar4Week className={styles.calendarIcon} />
// 				{formatDateRange(new Date(event.startDateTime), addMinutes(new Date(event.startDateTime), event.duration))}
// 			</div>

// 			<div className={styles.eventDescription}>
// 				<div className={styles.sectionHeading}>Description</div>
// 				{event.description}
// 			</div>
// 			<Separator.Root className={styles.separator} />

// 			<div className={styles.agenda}>
// 				<div className={styles.sectionHeading}>Agenda</div>
// 				<div className={styles.agendaContent}>
// 					{event.agenda.map((e: AgendaItem, index) => {
// 						return (
// 							<React.Fragment key={index}>
// 								<div style={{ gridRow: index + 1, gridColumn: 1 }}>{`${format(new Date(e.start), "h:mmaaa")} - ${format(new Date(e.end), "h:mmaaa")}`}</div>
// 								<div style={{ gridRow: index + 1, gridColumn: 3 }}>{e.description}</div>
// 							</React.Fragment>
// 						)
// 					})}
// 					<Separator.Root className={styles.separator} orientation={"vertical"} style={{ gridRowStart: 1, gridRowEnd: event.agenda.length + 1, gridColumn: 2 }} />
// 				</div>
// 			</div>
// 			<Separator.Root className={styles.separator} />
// 			<div className={styles.sectionHeading}>Options</div>
// 			{showButtons && <div className={styles.sectionPadding}>
// 				<small>Status: {ResponseState[responseState]}</small>
// 				<div className={`${styles.buttonOptions}`}>
// 					<div className={`${styles.button} ${styles.attend}`} onClick={() => {
// 						if (responseState !== ResponseState.attending) {
// 							onStateChange(ResponseState.attending);
// 						}
// 					}}>Attend</div>
// 					<div className={`${styles.button} ${styles.pending}`} onClick={() => {
// 						if (responseState !== ResponseState.pending) {
// 							onStateChange(ResponseState.pending);
// 						}
// 					}} >Unsure</div>
// 					<div className={`${styles.button} ${styles.decline}`} onClick={() => {
// 						if (responseState !== ResponseState.declined) {
// 							onStateChange(ResponseState.declined);
// 						}
// 					}} >Decline</div>
// 				</div>
// 			</div>}


// 			<Separator.Root className={styles.separator} />
// 			<div className={styles.invites}>
// 				<div className={styles.sectionHeading}>Invites</div>
// 				<Tabs.Root defaultValue="tab1">
// 					<Tabs.List className={styles.tabContainer}>
// 						<Tabs.Trigger className={styles.tab} value="tab1">
// 							Attending
// 							<small className={styles.attendingCount}>{attendingCount}</small>
// 						</Tabs.Trigger>
// 						<Tabs.Trigger className={styles.tab} value="tab2">
// 							Invited
// 							<small className={styles.inviteCount}>{invitedCount}</small>
// 						</Tabs.Trigger>
// 						<Tabs.Trigger className={styles.tab} value="tab3">
// 							Declined
// 							<small className={styles.declinedCount}>{declinedCount}</small>
// 						</Tabs.Trigger>
// 					</Tabs.List>
// 					<Tabs.Content value="tab1">
// 						{responseState === ResponseState.attending && <div className={styles.userItem}>
// 							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
// 							<div className={styles.userName}>Demo user</div>
// 						</div>
// 						}
// 						{attendingUsers.map((response, index) => {
// 							return <div key={response.user._id.toString()} className={styles.userItem}>
// 								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
// 								<div className={styles.userName}>{response.user.name}</div>
// 							</div>
// 						})}
// 					</Tabs.Content>
// 					<Tabs.Content value="tab2">
// 						{responseState === ResponseState.pending && <div className={styles.userItem}>
// 							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
// 							<div className={styles.userName}>Demo user</div>
// 						</div>
// 						}
// 						{invitedUsers.map((response) => {
// 							return <div key={response.user._id.toString()} className={styles.userItem}>
// 								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
// 								<div className={styles.userName}>{response.user.name}</div>
// 							</div>
// 						})}
// 					</Tabs.Content>
// 					<Tabs.Content value="tab3">
// 						{responseState === ResponseState.declined && <div className={styles.userItem}>
// 							<Image className={styles.avatarRoot} src={`/UserIcons/demo.png`} alt={"Demo user"} width={980} height={980} />
// 							<div className={styles.userName}>Demo user</div>
// 						</div>
// 						}
// 						{declinedUsers.map((response) => {
// 							return <div key={response.user._id.toString()} className={styles.userItem}>
// 								<Image className={styles.avatarRoot} src={`/UserIcons/${response.user.image}.png`} alt={"Demo user"} width={500} height={500} />
// 								<div className={styles.userName}>{response.user.name}</div>
// 							</div>
// 						})}
// 					</Tabs.Content>
// 				</Tabs.Root>
// 			</div>

// 		</div>
// 	)
// }