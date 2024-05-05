"use client"

import React, { useEffect, useRef, useState } from "react";
import { addHours, differenceInHours } from "date-fns";

const START_TIME = new Date(); // Start time in hours
const END_TIME = addHours(new Date(), 9); // End time in hours
const TOTAL_HOURS = differenceInHours(END_TIME, START_TIME);
const DIV_C_START_TIME = addHours(START_TIME, 2)
const DIV_C_END_TIME = addHours(START_TIME, 5)

export default function ViewEvent({ params }: { params: { id: string } }) {
	const divARef = useRef<HTMLDivElement>(null);
	const divBRef = useRef<HTMLDivElement>(null);
	const [hourWidth, setHourWidth] = useState(50);

	useEffect(() => {
		var divb = divBRef.current;
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				setHourWidth(entry.contentRect.width / TOTAL_HOURS);
			}
		});

		if (divb) {
			resizeObserver.observe(divb);
		}

		return () => {
			if (divb) {
				resizeObserver.unobserve(divb);
			}
		};
	}, [divBRef, divARef]);

	const handleDoubleClick = (e: React.MouseEvent) => {
		const x = e.clientX - divBRef.current!.getBoundingClientRect().left; // Get the x position relative to div B
		const hour = Math.floor(x / hourWidth); // Calculate the hour based on the x position
		const time = addHours(START_TIME, hour); // Calculate the actual time
		console.log(time);
	};

	return (
		<div id="a" ref={divARef} className="bg-red-200 h-96 w-[80%] overflow-x-auto">
			<div id="b" ref={divBRef} className={`bg-gradient-to-r from-blue-200 to-black h-32 min-w-full w-[1000px]`} onDoubleClick={handleDoubleClick}>

				<div id="c" style={{
					left: `${differenceInHours(DIV_C_START_TIME, START_TIME) * hourWidth}px`,
					width: `${differenceInHours(DIV_C_END_TIME, DIV_C_START_TIME) * hourWidth}px`
				}} className="relative bg-green-200 h-16">
				</div>
			</div>
		</div>
	)

}