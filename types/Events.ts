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

export interface EventResponse {
	id: string;
	eventId: string,
	userId: string,
	schedule: Array<TimePair>
}