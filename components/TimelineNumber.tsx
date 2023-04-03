import { eachHourOfInterval } from "date-fns";
import styles from "styles/Components/TimelineHours.module.scss"

interface Props {
	start: string;
	end: string;
}

export default function TimelineNumbers({ start, end }: Props) {
	const startTime = new Date(start);
	const endTime = new Date(end);
	const numberList: Array<Date> = eachHourOfInterval({ start: startTime, end: endTime });

	return (<div className={styles.pagination}>
		{
			numberList.map((hour: Date, index: number) => {
				return <div className={styles.hourCellHeading} key={index} >
					<div className={styles.hourCellLabel}>{`${hour.getHours()}:00`}</div>
				</div>
			})}
	</div >
	)
}