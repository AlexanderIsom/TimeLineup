
export default function TimelineNumbers() {
	const numberList: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	return (<>
		{numberList.map((num: number) => {
			return <div key={num}> {num} </div>
		})}
	</>
	)
}