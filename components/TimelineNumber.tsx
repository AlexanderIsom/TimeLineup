import { eachHourOfInterval } from "date-fns";
import styles from "styles/Components/TimelineHours.module.scss"

interface Props {
	start: Date;
	end: Date;
}

export default function TimelineNumbers({ start, end }: Props) {
	const numberList: Array<Date> = eachHourOfInterval({ start: start, end: end });

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