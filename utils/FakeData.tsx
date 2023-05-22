import { addDays, endOfMonth, roundToNearestMinutes, startOfMonth } from "date-fns";
import { Event, User } from "types/Events";
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

export function generateEvents() {
	const clonedEvents: jsonEvent[] = [];
	eventData.forEach(event => clonedEvents.push(Object.assign({}, event)));

	const eventsMax = 50;
	const eventsMin = 40;
	const quantityToGenerate = getRandomInt(eventsMin, eventsMax);

	var events = [];

	for (let index = 0; index < quantityToGenerate; index++) {
		var randomEvent = getRandomEvent(clonedEvents);
		var dateRange = generateRandomDateRange();
		const newAgenda = convertJsonAgenda(randomEvent.agenda);
		const user = getRandomUser()
		const newEvent: Event = {
			id: uuidv4(), user: user, userId: user.id, title: randomEvent.title,
			description: randomEvent.description, startDateTime: dateRange.start, endDateTime: dateRange.end,
			agenda: newAgenda
		}
		console.log(newEvent);
		events.push(newEvent);
	}

	return events
}

export function getUserByID(id: string) {
	return userData.find(e => { e.id === id })
}

function convertJsonAgenda(agenada: JsonAgenda[]) {
	const convertedAgenda = agenada.map((jsonAgendaItem) => {
		return { start: new Date(jsonAgendaItem.start), end: new Date(jsonAgendaItem.end), description: jsonAgendaItem.description }
	})
	return convertedAgenda;
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
	const now = new Date();
	var startDate = randomDate(startOfMonth(now), endOfMonth(now));
	var endDate = randomDate(startDate, addDays(startDate, 3));
	startDate = roundToNearestMinutes(startDate, { nearestTo: 15 })
	endDate = roundToNearestMinutes(endDate, { nearestTo: 15 })

	return { start: startDate, end: endDate }
}