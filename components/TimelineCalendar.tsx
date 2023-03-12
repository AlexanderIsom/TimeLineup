import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GenerateFakeData, timeWindow, fakeDataLayout } from "./GenerateFakeData";

export default function TimeCalendar() {
	const [userData, setUserData] = useState<fakeDataLayout[]>();

	useEffect(() => {
		setUserData(GenerateFakeData());
	}, [])

	return (
		<>
			{userData?.map((result: fakeDataLayout, index: number) => {
				return <li key={index}>
					{result.userName}
					<Image src={result.userImageUrl} alt="" width={50} height={50} />
					{result.avaliableWindows.map((w: timeWindow, subIndex: number) => {
						return <div key={subIndex}>{w.startTime.toISOString()}-{w.endTime.toISOString()}</div>
					})}
				</ li>
			})}
		</>
	)
}