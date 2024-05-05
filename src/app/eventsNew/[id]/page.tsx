"use client"

import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { addHours, differenceInMinutes, format, addMinutes } from "date-fns";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";

const START_TIME = new Date(2024, 0, 1, 13, 0, 0); // Start time in hours
const END_TIME = addHours(START_TIME, 9); // End time in hours
const TOTAL_MINUTES = differenceInMinutes(END_TIME, START_TIME);
const DIV_C_START_TIME = addHours(START_TIME, 2)
const DIV_C_END_TIME = addHours(START_TIME, 5)

const defaultWidth = 1000 / TOTAL_MINUTES;

export default function ViewEvent({ params }: { params: { id: string } }) {
	const divARef = useRef<HTMLDivElement>(null);
	const divBRef = useRef<HTMLDivElement>(null);
	const [minuteWidth, setMinuteWidth] = useState(defaultWidth);

	const [startTime, setStartTime] = useState(DIV_C_START_TIME);
	const [endTime, setEndTime] = useState(DIV_C_END_TIME);

	useEffect(() => {
		var divb = divBRef.current;
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				setMinuteWidth(entry.contentRect.width / TOTAL_MINUTES);
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
		const hour = Math.floor(x / minuteWidth); // Calculate the hour based on the x position
		const time = addHours(START_TIME, hour); // Calculate the actual time
		console.log(time);
	};

	const handleDrag = (e: DraggableEvent, data: DraggableData) => {
		const { deltaX } = data;
		const deltaMinutes = deltaX / minuteWidth;
		setStartTime(addMinutes(startTime, deltaMinutes));
		setEndTime(addMinutes(endTime, deltaMinutes));
	};

	const handleResize = (event: SyntheticEvent, data: ResizeCallbackData) => {
		const { size } = data;
		const { width } = size;
		const newEndTime = addMinutes(startTime, width / minuteWidth);
		setEndTime(newEndTime);
	};

	const testDrag = () => {
		console.log("dragging");
	}

	return (
		<div id="a" ref={divARef} className="bg-red-200 h-96 w-[80%] overflow-x-auto">
			<div id="b" ref={divBRef} className={`bg-gradient-to-r from-blue-200 to-black h-32 min-w-full w-[1000px]`} onDoubleClick={handleDoubleClick}>
				<Draggable onDrag={handleDrag} axis="x" position={{ x: differenceInMinutes(startTime, START_TIME) * minuteWidth, y: 0 }} bounds={"parent"}>
					{/* <div style={{ width: `${differenceInMinutes(endTime, startTime) * minuteWidth}px` }} className="bg-green-200 h-16"> */}
					<Resizable width={300} height={100} onResize={handleResize} axis="x">
						<div id="c" style={{ width: `300px`, height: "100px" }} className="relative flex bg-green-200  h-16 justify-between">
							<span className="bg-red-500">{format(startTime, "HH:mm")}</span>
							<span className="bg-red-500">{format(endTime, "HH:mm")}</span>
						</div>
					</Resizable>
					{/* </div> */}
				</Draggable>
			</div>
		</div>
	)

}