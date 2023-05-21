import { addDays, endOfMonth, roundToNearestMinutes, startOfMonth } from "date-fns";
import { Event } from "types/Events";
import { v4 as uuidv4 } from "uuid"
import eventData = require("./Titles.json")

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
		const newEvent: Event = {
			user: getRandomUser(),
			id: uuidv4(), userId: uuidv4(), title: randomEvent.title,
			description: randomEvent.description, startDateTime: dateRange.start, endDateTime: dateRange.end,
			agenda: newAgenda
		}
		events.push(newEvent);
	}

	return events
}

function convertJsonAgenda(agenada: JsonAgenda[]) {
	const convertedAgenda = agenada.map((jsonAgendaItem) => {
		return { start: new Date(jsonAgendaItem.start), end: new Date(jsonAgendaItem.end), description: jsonAgendaItem.description }
	})
	return convertedAgenda;
}

function getRandomUser() {
	const newUser = {
		id: "64207b44dde0af34e25432aa",
		name: "Alex",
		image: "https://cdn.discordapp.com/avatars/202124390819823616/2f0e8e49ce678d7e39656f5cbb75875c.png",
		emailVerified: new Date(),
	}
	return newUser
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