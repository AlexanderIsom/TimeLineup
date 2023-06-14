import { addMinutes, max, min, roundToNearestMinutes, startOfMonth, subMinutes } from "date-fns";
import { Event, User } from "types/Events";
import { v4 as uuidv4 } from "uuid"
import * as eventData from "./Titles.json"
import * as userData from "./Users.json"

interface JsonAgenda {
	start: string,
	end: string,
	description: string,
}

interface jsonEvent {
	title: string,
	description: string,
	agenda: JsonAgenda[],
}

interface CustomEvent {
	userId: string,
	title: string,
	description: string,
	agenda: any[],
}

export function generateEvents(users: User[]) {
	const clonedEvents: jsonEvent[] = [];
	eventData.forEach(event => clonedEvents.push(Object.assign({}, event)));

	var events = [];

	for (let index = 0; index < 50; index++) {
		var randomEvent = getRandomEvent(clonedEvents);
		const newAgenda = convertJsonAgenda(randomEvent.agenda);
		const user = users[Math.floor(Math.random() * users.length)];
		const newEvent = {
			userId: user.id, title: randomEvent.title,
			startDateTime: { $date: newAgenda.range.start },
			endDateTime: { $date: newAgenda.range.end },
			description: randomEvent.description,
			agenda: newAgenda.agenda,
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
			weekOffset: Math.round((Math.random() - 0.5) * 2),
			day: Math.floor(Math.random() * 7),
		}
		events.push(newEvent);

	}

	return events
}

export function getUserByID(id: string) {
	return userData.find(e => { e.id === id })
}

function convertJsonAgenda(agenada: JsonAgenda[]) {
	let first: Date | undefined;
	let last: Date | undefined;
	const convertedAgenda = agenada.map((jsonAgendaItem) => {
		if (first == undefined) {
			first = new Date(jsonAgendaItem.start);
		}
		if (last == undefined) {
			last = new Date(jsonAgendaItem.end);
		}
		first = min([first, new Date(jsonAgendaItem.start)])
		last = max([last, new Date(jsonAgendaItem.end)])
		return { start: { $date: new Date(jsonAgendaItem.start) }, end: { $date: new Date(jsonAgendaItem.end) }, description: jsonAgendaItem.description }
	})
	return {
		agenda: convertedAgenda, range: { start: first, end: last }
	};
}

interface Thing {
	eventId: string;
	userId: string;
	schedule: otherThing[];
	declined: boolean;
}

export function generateRandomAttendingTimes(events: Event[], users: User[]) {
	const responses: Thing[] = [];

	events.forEach(event => {
		users.forEach((user) => {
			if (user.id !== event.userId && user.id !== "647c821293f33f0dca004c4d") {
				const newResponse: Thing = {
					eventId: event.id,
					userId: user.id,
					schedule: generateRandomSchedule(event),
					declined: Math.random() * 10 <= 1 ? true : false,
				}
				responses.push(newResponse);
			};
		});
	});


	console.log(JSON.stringify(responses));
}

interface otherThing {
	id: string;
	start: {
		$date: Date;
	};
	end: {
		$date: Date;
	};
}

function generateRandomSchedule(event: Event) {

	let slots = getRandomInt(1, 2);
	slots = Math.random() * 10 < 1 ? 0 : slots
	const schedule: otherThing[] = [];
	let latestDate = new Date(event.startDateTime)
	const endAsDate = new Date(event.endDateTime);
	for (let index = 0; index < slots; index++) {
		const startDate = roundToNearestMinutes(randomDate(latestDate, subMinutes(endAsDate, 60)), { nearestTo: 15 })
		const endDate = roundToNearestMinutes(randomDate(addMinutes(startDate, 30), endAsDate), { nearestTo: 15 })
		latestDate = endDate;

		const element: otherThing = {
			id: uuidv4(),
			start: {
				$date: startDate
			},
			end: {
				$date: endDate
			}
		};

		schedule.push(element);
	}
	return schedule;
}

function getRandomUser() {
	const index = Math.floor(Math.random() * userData.length);
	const userClone = Object.assign({}, userData[index]) as User;
	userClone.emailVerified = new Date();
	return userClone
}

function getRandomEvent(clonedEvents: jsonEvent[]) {
	const selectionIndex = Math.floor(Math.random() * clonedEvents.length);
	const selection = Object.assign({}, clonedEvents[selectionIndex]);
	if (clonedEvents.length > 1) {
		clonedEvents.splice(selectionIndex, 1);
	}
	return selection;
}

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function randomDate(start: Date, end: Date) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomDateRange(): { start: Date, end: Date } {
	const startDate = new Date('2023-01-01T07:00:00')
	const endDate = new Date('2023-01-01T23:59:59')

	var startTime = roundToNearestMinutes(randomDate(startDate, endDate), { nearestTo: 15 });
	var endTime = roundToNearestMinutes(randomDate(startTime, endDate), { nearestTo: 15 });
	startTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
	endTime = roundToNearestMinutes(endDate, { nearestTo: 15 })

	return { start: startTime, end: endTime }
}