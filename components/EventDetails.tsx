import eventDetailStyle from "styles/Components/EventDetails.module.scss"
import { formatDateRange } from "utils/TimeUtils"
import { BsCalendar4Week } from "react-icons/bs"
import * as Tabs from "@radix-ui/react-tabs"
import * as Separator from "@radix-ui/react-separator"
import { Event } from "types/Events"
import * as Avatar from "@radix-ui/react-avatar"
import React from "react";
import { format } from "date-fns";
interface Props {
	event: Event
}

export default function EventDetails({ event }: Props) {
	return (
		<div className={eventDetailStyle.container} >
			<div className={eventDetailStyle.heading}>
				<div className={eventDetailStyle.eventTitle}>
					{event.title}
				</div>
				<div className={eventDetailStyle.eventHostInformation}>
					<Avatar.Root className={eventDetailStyle.avatarRoot} >
						<Avatar.Image src={`/UserIcons/${event.user.image}.png`} alt={event.user.name} className={eventDetailStyle.userAvatar} />
						<Avatar.Fallback className={eventDetailStyle.avatarFallback} delayMs={600}>
							{event.user.name.slice(0, 2)}
						</Avatar.Fallback>
					</Avatar.Root>
					{event.user.name}
				</div>
			</div>
			<Separator.Root className={eventDetailStyle.separator} />
			<div className={eventDetailStyle.eventDate}>
				<BsCalendar4Week className={eventDetailStyle.calendarIcon} />
				{formatDateRange(event.startDateTime, event.endDateTime)}
			</div>

			<div className={eventDetailStyle.eventDescription}>
				<div className={eventDetailStyle.sectionHeading}>Description</div>
				{event.description}
			</div>
			<Separator.Root className={eventDetailStyle.separator} />

			<div className={eventDetailStyle.agenda}>
				<div className={eventDetailStyle.sectionHeading}>Agenda</div>
				<div className={eventDetailStyle.agendaContent}>
					{event.agenda.map((e, index) => {
						return (
							<React.Fragment key={index}>
								<div style={{ gridRow: index + 1, gridColumn: 1 }}>{`${format(new Date(e.start), "h:mmaaa")} - ${format(new Date(e.end), "h:mmaaa")}`}</div>
								<div style={{ gridRow: index + 1, gridColumn: 3 }}>{e.description}</div>
							</React.Fragment>
						)
					})}
					<Separator.Root className={eventDetailStyle.separator} orientation={"vertical"} style={{ gridRowStart: 1, gridRowEnd: event.agenda.length + 1, gridColumn: 2 }} />
				</div>
			</div>

			<Separator.Root className={eventDetailStyle.separator} />
			<div className={eventDetailStyle.invites}>
				<div className={eventDetailStyle.sectionHeading}>Invites</div>
				<Tabs.Root defaultValue="tab1">
					<Tabs.List className={eventDetailStyle.tabContainer}>
						<Tabs.Trigger className={eventDetailStyle.tab} value="tab1">
							Attending
							<div className={eventDetailStyle.attendingCount}>12</div>
						</Tabs.Trigger>
						<Tabs.Trigger className={eventDetailStyle.tab} value="tab2">
							Invited
							<div className={eventDetailStyle.inviteCount}>5</div>
						</Tabs.Trigger>
						<Tabs.Trigger className={eventDetailStyle.tab} value="tab3">
							Declined
							<div className={eventDetailStyle.declinedCount}>8</div>
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="tab1">
						<div>this is for attendes</div>
					</Tabs.Content>
					<Tabs.Content value="tab2">
						<div>this is for invites</div>
					</Tabs.Content>
					<Tabs.Content value="tab3">
						<div>this is for declined</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>

		</div>
	)
}