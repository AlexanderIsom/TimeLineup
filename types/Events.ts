import { Timestamp } from "firebase/firestore";

export interface EventData {
	id: string,
	userId: string,
	title: string,
	startTimestamp: Timestamp,
	endTimestamp: Timestamp,
	user: User,
	description: string,
	agenda: AgendaItem[],
	color: string,
	weekOffset: number,
	day: number
}

export interface AgendaItem {
	start: Date,
	end: Date,
	description: string
}

export interface TimePair {
	id: string,
	start: Date,
	end: Date
}

export interface User {
	emailVerified: Date,
	name: string,
	id: string,
	image: string
}

export interface EventResponse {
	id: string;
	eventId: string,
	userId: string,
	user: User,
	schedule: Array<TimePair>
	declined: boolean
}