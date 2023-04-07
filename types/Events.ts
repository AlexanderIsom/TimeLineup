export interface Event {
	id: string,
	userId: string,
	title: string,
	startDateTime: string,
	endDateTime: string,
}

export interface EventResponse {
	id: string;
	eventId: string,
	userId: string,
	startDateTime: Date,
	endDateTime: Date,
}