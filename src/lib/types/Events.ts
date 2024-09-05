export interface EventData {
	id: string;
	userId: string;
	title: string;
	start: Date;
	end: Date;
	description: string;
	invitedUsers: string[];
}

export interface AgendaItem {
	start: Date;
	end: Date;
	description: string;
	id?: string;
}

export interface TimeDuration {
	id: string;
	offsetFromStart: number;
	duration: number;
}

export interface User {
	emailVerified: Date;
	name: string;
	_id: string;
	image: string;
}

export interface EventResponse {
	id: string;
	eventId: string;
	userId: string;
	user: User;
	schedule: Array<TimeDuration>;
}
