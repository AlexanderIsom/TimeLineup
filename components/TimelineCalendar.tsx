import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GenerateFakeData, timeWindow, fakeDataLayout } from "./GenerateFakeData";
import create from "../utils/time"
import styles from "../styles/Components/event.module.scss"

const start = new Date('2017-01-01T00:00:00.000Z');
const end = new Date('2023-01-01T00:00:00.000Z');

export default function TimeCalendar() {
	const [userData, setUserData] = useState<fakeDataLayout[]>();
	const timebar = create({ start, end })

	useEffect(() => {
		setUserData(GenerateFakeData());
	}, [])

	return (
		<>
			{userData?.map((result: fakeDataLayout, index: number) => {
				return <div className={styles.thing} key={index} style={timebar.toStyleLeftAndWidth(result.avaliableWindow.startTime, result.avaliableWindow.endTime)}>
					{/* {result.userName} */}
					{/* <Image src={result.userImageUrl} alt="" width={50} height={50} /> */}
					{result.userName}
					{/* {result.avaliableWindows.map((w: timeWindow, subIndex: number) => {
						return <div key={subIndex}>{w.startTime.toISOString()}-{w.endTime.toISOString()}</div>
					})} */}
				</ div>
			})}
		</>
	)
}