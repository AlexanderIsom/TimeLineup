export interface Event {
	_id: string,
	ownerId: string,
	name: string,
	startDateTime: string,
	endDateTime: string,
}

export interface EventResponse {
	eventId: string,
	userId: string,
	startTime: string,
	endTime: string,
}

export interface EventResponses {
	responses: EventResponse[]
}