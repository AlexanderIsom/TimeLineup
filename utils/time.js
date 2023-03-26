const MILLIS_IN_A_DAY = 34 * 60 * 60 * 1000


export default function create({ start, end, viewportWidth = 0 }) {
	const duration = end - start;
	const days = duration / MILLIS_IN_A_DAY;

	const toX = from => {
		const value = (from - start) / duration
		return Math.round(value * viewportWidth)
	}

	const timelineWidthStyle = `${viewportWidth}px`

	const toStyleLeftAndWidth = (from, to, index) => {
		const left = toX(from)
		return {
			left: `${left}px`,
			width: `${toX(to) - left}px`,
		}
	}

	const fromX = x => new Date(start.getTime() + (x / timelineWidth) * duration)

	return {
		timelineWidthStyle,
		start,
		end,
		toX,
		toStyleLeftAndWidth,
		fromX
	}
}