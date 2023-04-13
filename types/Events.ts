export interface Event {
	id: string,
	userId: string,
	title: string,
	startDateTime: string,
	endDateTime: string,
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