import styles from "../styles/Components/TimelineHours.module.scss"

export default function TimelineNumbers() {
	//TODO show hours based on start and end times
	// could be 200 px per hour, calculate the hours and that will give viewport width, min width of the fr value
	const numberList: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	return (<div className={styles.pagination}>
		{numberList.map((num: number) => {
			return <div key={num} style={{ width: "80px", justifyContent: "center", textAlign: "center" }}> {num} </div>
		})}
	</div>
	)
}