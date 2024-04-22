import { NearestMinutes, addHours, addMinutes, differenceInHours, differenceInMinutes, eachHourOfInterval, format, isEqual, roundToNearestHours, roundToNearestMinutes, subHours, subMinutes } from "date-fns";

export default class Timeline {
	private static widthInPixels: number;
	private static durationInMinutes: number;
	private static startDateTime: Date;
	private static snapToNearestMinutes: NearestMinutes;
	public static cellWidth = 200;
	public static bounds = { min: 0, max: 0 };
	public static padding = { left: 0, right: 0 };
	public static headingNumbers: Array<Date>;
	public static instance: Timeline;

	constructor(startDate: Date, endDate: Date, snapToNearestMinutes: NearestMinutes) {
		let roundedStartTime = roundToNearestHours(startDate, { roundingMethod: "floor" });
		let roundedEndTime = roundToNearestHours(endDate, { roundingMethod: "ceil" });

		if (differenceInHours(roundedEndTime, roundedStartTime) <= 4) {
			roundedEndTime = addHours(roundedEndTime, 2);
			Timeline.cellWidth = 300;
		}
		Timeline.startDateTime = roundedStartTime
		const durationInHours = differenceInHours(roundedEndTime, roundedStartTime);
		Timeline.durationInMinutes = differenceInMinutes(roundedEndTime, roundedStartTime);
		Timeline.widthInPixels = durationInHours * Timeline.cellWidth;
		Timeline.snapToNearestMinutes = snapToNearestMinutes;
		Timeline.bounds = { min: Timeline.dateToXPosition(startDate), max: Timeline.dateToXPosition(endDate) }
		const padLeft = isEqual(startDate, roundedStartTime) ? 0 : Timeline.bounds.min
		Timeline.headingNumbers = eachHourOfInterval({ start: roundedStartTime, end: roundedEndTime });
		const padRight = isEqual(endDate, roundedEndTime) ? 0 : Timeline.dateToXPosition(roundedEndTime) - Timeline.bounds.max;
		Timeline.padding = { left: padLeft, right: padRight };
	}

	static getNumbers() {
		return this.headingNumbers
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

	static getPadding() {
		return this.padding;
	}

	static destroy() {
		this.destroy();
	}
}