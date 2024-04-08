import { NearestMinutes, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

export default class Timeline {
	private static widthInPixels: number;
	private static durationInSeconds: number;
	private static durationInMinutes: number;
	private static startDateTime: Date;
	private static snapToNearestMinutes: NearestMinutes;
	public static widthPerHour = 100;

	constructor(startDate: Date, endDate: Date, snapToNearestMinutes: NearestMinutes) {
		Timeline.startDateTime = startDate;
		const durationInHours = differenceInHours(endDate, startDate);
		Timeline.durationInMinutes = differenceInMinutes(endDate, startDate);
		Timeline.widthInPixels = durationInHours * Timeline.widthPerHour;
		Timeline.snapToNearestMinutes = snapToNearestMinutes;
	}

	static setWidth(width: number) {
		this.widthInPixels = width;
	}

	static getSnapToNearestMinutes(): NearestMinutes {
		return this.snapToNearestMinutes;
	}

	static dateToXPosition(from: Date): number {
		return ((differenceInMinutes(from, this.startDateTime)) / this.durationInMinutes) * this.widthInPixels
	}

	static minutesToXPosition(minutes: number) {
		const value = Math.round((minutes / this.durationInMinutes) * this.widthInPixels)
		return value
	}

	static xPositionToMinutes(x: number) {
		return x / this.widthInPixels * this.durationInMinutes
	}

	static getWidth(): number {
		return this.widthInPixels;
	}
}