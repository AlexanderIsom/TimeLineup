import { addDays, endOfMonth, max, min, roundToNearestMinutes, startOfMonth } from "date-fns";
import { Event, User, AgendaItem } from "types/Events";
import { v4 as uuidv4 } from "uuid"
import eventData = require("./Titles.json")
import userData = require("./Users.json")

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

export function generateEvents() {
	const clonedEvents: jsonEvent[] = [];
	eventData.forEach(event => clonedEvents.push(Object.assign({}, event)));

	var events = [];

	for (let index = 0; index < 50; index++) {
		var randomEvent = getRandomEvent(clonedEvents);
		const newAgenda = convertJsonAgenda(randomEvent.agenda);
		const user = getRandomUser()
		const newEvent = {
			userId: user.id, title: randomEvent.title,
			startDateTime: { $date: newAgenda.range.start },
			endDateTime: { $date: newAgenda.range.end },
			description: randomEvent.description,
			agenda: newAgenda.agenda
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