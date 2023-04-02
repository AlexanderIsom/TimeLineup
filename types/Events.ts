export interface Event {
	id: string,
	userId: string,
	title: string,
	startDateTime: string,
	endDateTime: string,
}

export interface EventResponse {
	eventId: string,
	userId: string,
	startDateTime: string,
	endDateTime: string,
}