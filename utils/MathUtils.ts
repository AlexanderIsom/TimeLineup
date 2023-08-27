export default class MathUtils {
	static isBetween(num: number, lowerBound: number, upperBound: number): boolean {
		return num > lowerBound && num < upperBound;
	}

	static roundToNearest(value: number, nearest: number): number {
		return Math.round(value / nearest) * nearest;
	}
}