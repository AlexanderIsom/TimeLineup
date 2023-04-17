export interface Event {
	id: string,
	userId: string,
	title: string,
	startDateTime: Date,
	endDateTime: Date,
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
}