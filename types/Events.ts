import { ObjectId } from "mongodb";

export interface EventData {
	_id: ObjectId,
	userId: ObjectId,
	title: string,
	startDateTime: Date,
	endDateTime: Date,
	user: User,
	description: string,
	agenda: AgendaItem[],
	color: string,
	weekOffset: number,
	day: number
	status: string;
}

export interface AgendaItem {
	start: Date,
	end: Date,
	description: string
}

export interface TimeDuration {
	id: string,
	start: Date,
	duration: number,
}

export interface User {
	emailVerified: Date,
	name: string,
	_id: string,
	image: string
}

export interface EventResponse {
	id: string;
	eventId: string,
	userId: string,
	user: User,
	schedule: Array<TimeDuration>
	declined: boolean
}