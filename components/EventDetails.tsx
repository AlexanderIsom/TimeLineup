import styles from "styles/Components/EventDetails.module.scss"
import { formatDateRange } from "utils/TimeUtils"
import { BsCalendar4Week } from "react-icons/bs"
import * as Tabs from "@radix-ui/react-tabs"
import * as Separator from "@radix-ui/react-separator"
import { EventData, EventResponse, TimePair } from "types/Events"
import * as Avatar from "@radix-ui/react-avatar"
import React from "react";
import { format } from "date-fns";
interface Props {
	event: EventData
	userResponses: EventResponse[];
	localResponse: TimePair[];
}

export default function EventDetails({ event, userResponses, localResponse }: Props) {
	const declinedUsers = userResponses.filter((reponse) => {
		return reponse.declined === true;
	})

	const invitedUsers = userResponses.filter((reponse) => {
		return reponse.schedule.length === 0;
	})

	const attendingUsers = userResponses.filter((reponse) => {
		return reponse.schedule.length > 0;
	})

	var attendingCount = attendingUsers.length;
	var invitedCount = invitedUsers.length;
	var declinedCount = declinedUsers.length;

	if (localResponse.length > 0) {
		attendingCount += 1;
	}

	if (localResponse.length === 0) {
		invitedCount += 1;
	}

	return (
		<div className={styles.container} >
			<div className={styles.heading}>
				<div className={styles.eventTitle}>
					{event.title}
				</div>
				<div className={styles.eventHostInformation}>
					<Avatar.Root className={styles.avatarRoot} >
						<Avatar.Image src={`/UserIcons/${event.user.image}.png`} alt={event.user.name} className={styles.userAvatar} />
						<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
							{event.user.name.slice(0, 2)}
						</Avatar.Fallback>
					</Avatar.Root>
					{event.user.name}
				</div>
			</div>
			<Separator.Root className={styles.separator} />
			<div className={styles.eventDate}>
				<BsCalendar4Week className={styles.calendarIcon} />
				{formatDateRange(event.startTimestamp, event.endTimestamp)}
			</div>

			<div className={styles.eventDescription}>
				<div className={styles.sectionHeading}>Description</div>
				{event.description}
			</div>
			<Separator.Root className={styles.separator} />

			<div className={styles.agenda}>
				<div className={styles.sectionHeading}>Agenda</div>
				<div className={styles.agendaContent}>
					{event.agenda.map((e, index) => {
						return (
							<React.Fragment key={index}>
								<div style={{ gridRow: index + 1, gridColumn: 1 }}>{`${format(new Date(e.start), "h:mmaaa")} - ${format(new Date(e.end), "h:mmaaa")}`}</div>
								<div style={{ gridRow: index + 1, gridColumn: 3 }}>{e.description}</div>
							</React.Fragment>
						)
					})}
					<Separator.Root className={styles.separator} orientation={"vertical"} style={{ gridRowStart: 1, gridRowEnd: event.agenda.length + 1, gridColumn: 2 }} />
				</div>
			</div>

			<Separator.Root className={styles.separator} />
			<div className={styles.invites}>
				<div className={styles.sectionHeading}>Invites</div>
				<Tabs.Root defaultValue="tab1">
					<Tabs.List className={styles.tabContainer}>
						<Tabs.Trigger className={styles.tab} value="tab1">
							Attending
							<div className={styles.attendingCount}>{attendingCount}</div>
						</Tabs.Trigger>
						<Tabs.Trigger className={styles.tab} value="tab2">
							Invited
							<div className={styles.inviteCount}>{invitedCount}</div>
						</Tabs.Trigger>
						<Tabs.Trigger className={styles.tab} value="tab3">
							Declined
							<div className={styles.declinedCount}>{declinedCount}</div>
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="tab1">
						{localResponse.length > 0 && <div className={styles.userItem}>
							<Avatar.Root className={styles.avatarRoot} >
								<Avatar.Image src={`/UserIcons/demo.png`} alt={"demo user"} className={styles.userAvatar} />
								<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
									{"DE"}
								</Avatar.Fallback>
							</Avatar.Root>
							<div className={styles.userName}>Demo user</div>
						</div>
						}
						{attendingUsers.map((response) => {
							return <div key={response.user.id} className={styles.userItem}>
								<Avatar.Root className={styles.avatarRoot} >
									<Avatar.Image src={`/UserIcons/${response.user.image}.png`} alt={response.user.name} className={styles.userAvatar} />
									<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
										{response.user.name.slice(0, 2)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})}
					</Tabs.Content>
					<Tabs.Content value="tab2">
						{localResponse.length === 0 && <div className={styles.userItem}>
							<Avatar.Root className={styles.avatarRoot} >
								<Avatar.Image src={`/UserIcons/demo.png`} alt={"demo user"} className={styles.userAvatar} />
								<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
									{"DE"}
								</Avatar.Fallback>
							</Avatar.Root>
							<div className={styles.userName}>Demo user</div>
						</div>
						}
						{invitedUsers.map((response) => {
							return <div key={response.user.id} className={styles.userItem}>
								<Avatar.Root className={styles.avatarRoot} >
									<Avatar.Image src={`/UserIcons/${response.user.image}.png`} alt={response.user.name} className={styles.userAvatar} />
									<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
										{response.user.name.slice(0, 2)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})}
					</Tabs.Content>
					<Tabs.Content value="tab3">
						{declinedUsers.map((response) => {
							return <div key={response.user.id} className={styles.userItem}>
								<Avatar.Root className={styles.avatarRoot} >
									<Avatar.Image src={`/UserIcons/${response.user.image}.png`} alt={response.user.name} className={styles.userAvatar} />
									<Avatar.Fallback className={styles.avatarFallback} delayMs={600}>
										{response.user.name.slice(0, 2)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div className={styles.userName}>{response.user.name}</div>
							</div>
						})}
					</Tabs.Content>
				</Tabs.Root>
			</div>

		</div>
	)
}