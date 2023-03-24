export interface Event {
	id: string,
	userId: string,
	title: string,
	startDateTime: Date,
	endDateTime: Date,
}

export interface EventResponse {
	eventId: string,
	userId: string,
	startDateTime: string,
	endDateTime: string,
}