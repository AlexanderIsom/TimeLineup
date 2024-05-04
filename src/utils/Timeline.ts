import { NearestMinutes, addHours, addMinutes, differenceInHours, differenceInMinutes, eachHourOfInterval, format, isEqual, roundToNearestHours, roundToNearestMinutes } from "date-fns";
import MathUtils from "./MathUtils";
export default class Timeline {
	private static widthInPixels: number;
	private static durationInMinutes: number;
	private static startDateTime: Date;
	public static cellWidth = 200;
	public static bounds = { min: 0, max: 0 };
	public static padding = { left: 0, right: 0 };
	public static headingNumbers: Array<Date>;
	public static instance: Timeline;
	public static nearestMinutesAsX: number;
	public static minWidth: number = 0;
	public static durationInHours: number;
	public static snapToNearestMinutes: NearestMinutes;

	constructor(startDate: Date, endDate: Date, snapToNearestMinutes: NearestMinutes) {
		let roundedStartTime = roundToNearestHours(startDate, { roundingMethod: "floor" });
		let roundedEndTime = roundToNearestHours(endDate, { roundingMethod: "ceil" });

		if (differenceInHours(roundedEndTime, roundedStartTime) <= 4) {
			roundedEndTime = addHours(roundedEndTime, 2);
			Timeline.cellWidth = 300;
		}
		Timeline.startDateTime = roundedStartTime
		Timeline.durationInHours = differenceInHours(roundedEndTime, roundedStartTime);
		Timeline.durationInMinutes = differenceInMinutes(roundedEndTime, roundedStartTime);
		Timeline.widthInPixels = Timeline.durationInHours * Timeline.cellWidth;
		Timeline.bounds = { min: Timeline.dateToX(startDate), max: Timeline.dateToX(endDate) }
		const padLeft = isEqual(startDate, roundedStartTime) ? 0 : Timeline.bounds.min
		Timeline.headingNumbers = eachHourOfInterval({ start: roundedStartTime, end: roundedEndTime });
		const padRight = isEqual(endDate, roundedEndTime) ? 0 : Timeline.dateToX(roundedEndTime) - Timeline.bounds.max;
		Timeline.padding = { left: padLeft, right: padRight };
		Timeline.nearestMinutesAsX = (Timeline.widthInPixels / Timeline.durationInMinutes) * snapToNearestMinutes
		Timeline.snapToNearestMinutes = snapToNearestMinutes;
	}

	static setMinWidth(width: number) {
		this.minWidth = width;
		if (this.durationInHours * this.cellWidth < this.minWidth) {
			this.widthInPixels = this.minWidth;
			this.cellWidth = this.minWidth / this.durationInHours;
			this.nearestMinutesAsX = (this.widthInPixels / this.durationInMinutes) * this.snapToNearestMinutes
		}
	}

	static snapXToNearestMinutes(x: number) {
		return MathUtils.roundToNearest(x, this.nearestMinutesAsX)
	}

	static getNumbers() {
		return this.headingNumbers
	}

	static dateToX(from: Date): number {
		return ((differenceInMinutes(from, this.startDateTime)) / this.durationInMinutes) * this.widthInPixels
	}

	static XToDate(x: number) {
		const minutes = this.xPositionToMinutes(x);
		return addMinutes(this.startDateTime, minutes);
	}

	static minutesToX(minutes: number) {
		const value = Math.round((minutes / this.durationInMinutes) * this.widthInPixels)
		return value
	}

	static xPositionToMinutes(x: number) {
		return x / this.widthInPixels * this.durationInMinutes
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
}