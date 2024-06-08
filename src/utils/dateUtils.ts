import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";

export function formatDateRange(start: Date, end: Date): string {
	let formatString = "";
	let endFormatString = "";
	if (!isSameYear(start, end)) {
		formatString += "yyyy ";
	}
	if (!isSameMonth(start, end)) {
		endFormatString += "MMM ";
	}
	if (!isSameDay(start, end)) {
		endFormatString += "do ";
	}
	return `${format(start, formatString + "MMM do h:mm")} - ${format(end, formatString + endFormatString + "h:mm")}`;
}
