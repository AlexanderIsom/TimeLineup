import { addDays, endOfMonth, roundToNearestMinutes, startOfMonth } from "date-fns";
import { Event } from "types/Events";
import { v4 as uuidv4 } from "uuid"
import eventData = require("./Titles.json")


export function generateEvents() {
	const eventsMax = 50;
	const eventsMin = 40;
	const quantityToGenerate = getRandomInt(eventsMin, eventsMax);

	const events = [];

	for (let index = 0; index < quantityToGenerate; index++) {
		var generatedTitle = getRandomTitle();
		var dateRange = generateRandomDateRange();
		var user;
		const newEvent: Event = {
			id: uuidv4(), userId: uuidv4(), title: generatedTitle.title,
			description: generatedTitle.description, startDateTime: dateRange.start, endDateTime: dateRange.end,
		}
	}

	return "thing"
}

function getRandomTitle() {
	const selectionIndex = Math.floor(Math.random() * eventData.length);
	const selection = eventData[selectionIndex]
	eventData.splice(selectionIndex, 1);
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