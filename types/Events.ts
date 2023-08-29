import { ObjectId } from "mongodb";

export enum ResponseState {
	attending,
	pending,
	declined,
	hosting
}

export interface EventData {
	_id: ObjectId,
	userId: ObjectId,
	title: string,
	startDateTime: Date,
	duration: number,
	user: User,
	description: string,
	agenda: AgendaItem[],
	eventResponse: EventResponse[],
	color: string,
	weekOffset: number,
	day: number
}

export interface AgendaItem {
	start: Date,
	end: Date,
	description: string
}

export interface TimeDuration {
	id: string,
	offsetFromStart: number,
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
	state: ResponseState
}