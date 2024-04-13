import { NearestMinutes, addMinutes, differenceInHours, differenceInMinutes, format, roundToNearestHours, roundToNearestMinutes } from "date-fns";

export default class Timeline {
	private static widthInPixels: number;
	private static durationInMinutes: number;
	private static startDateTime: Date;
	private static snapToNearestMinutes: NearestMinutes;
	public static cellWidth = 100;
	public static bounds = { min: 0, max: 0 };
	public static minBoundary = 0;
	public static maxBoundary = 0;

	constructor(startDate: Date, endDate: Date, snapToNearestMinutes: NearestMinutes) {
		const roundedStartTime = roundToNearestHours(startDate, { roundingMethod: "floor" });
		const roundedEndTime = roundToNearestHours(endDate, { roundingMethod: "ceil" });
		Timeline.startDateTime = roundedStartTime
		const durationInHours = differenceInHours(roundedEndTime, roundedStartTime);
		Timeline.durationInMinutes = differenceInMinutes(roundedEndTime, roundedStartTime);
		Timeline.widthInPixels = durationInHours * Timeline.cellWidth;
		Timeline.snapToNearestMinutes = snapToNearestMinutes;
		Timeline.bounds = { min: Timeline.dateToXPosition(startDate), max: Timeline.dateToXPosition(endDate) }
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

	static formatMinutes(value: number) {
		return format(roundToNearestMinutes(addMinutes(this.startDateTime, value), { nearestTo: this.getSnapToNearestMinutes() }), "HH:mm")
	}

	static getWidth(): number {
		return this.widthInPixels;
	}


	static getCellWidth(): number {
		return this.cellWidth
	}
	static getBounds() {
		return this.bounds;
	}
}