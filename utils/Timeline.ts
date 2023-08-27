import { differenceInSeconds } from "date-fns";

export default class Timeline {
	private static widthInPixels: number;
	private static durationInSeconds: number;
	private static startDateTime: Date;
	private static snapToNearestMinutes: number;

	constructor(startDateTime: Date, duration: number, canvasWidth: number, snapToNearestMinutes: number) {
		Timeline.startDateTime = startDateTime;
		Timeline.durationInSeconds = duration * 60;
		Timeline.widthInPixels = canvasWidth;
		Timeline.snapToNearestMinutes = snapToNearestMinutes;
	}

	static setWidth(width: number) {
		this.widthInPixels = width;
	}

	static getSnapToNearestMinutes(): number {
		return this.snapToNearestMinutes;
	}

	static dateToXPosition(from: Date): number {
		return Math.round(((differenceInSeconds(from, this.startDateTime)) / this.durationInSeconds) * this.widthInPixels)
	}

	static minutesToXPosition(minutes: number) {
		const value = Math.round(((minutes * 60) / this.durationInSeconds) * this.widthInPixels)
		return value
	}

	static xPositionToMinutes(x: number) {
		return (x / this.widthInPixels * this.durationInSeconds) / 60
	}

	static getWidth(): number {
		return this.widthInPixels;
	}
}
