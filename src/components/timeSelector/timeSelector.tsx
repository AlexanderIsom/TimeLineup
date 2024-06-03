"use client";

import { Button } from "../ui/button";
import styles from "./timeSelector.module.scss";
import { Separator } from "../ui/separator";

interface Props {
	value: Date;
	onSelected: (hours: number, minutes: number) => void;
}

export default function TimeSelector(props: Props) {
	const hour = props.value.getHours();
	const minute = props.value.getMinutes();

	const hourElements = [];
	const minuteElements = [];

	for (let i = 0; i < 24; i++) {
		hourElements.push(
			<Button
				variant={hour === i ? "default" : "ghost"}
				key={i}
				className={`w-4`}
				onClick={() => {
					props.onSelected(i, minute);
				}}
			>
				{i.toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}
			</Button>,
		);
	}

	for (let i = 0; i < 12; i++) {
		minuteElements.push(
			<Button
				variant={minute === i * 5 ? "default" : "ghost"}
				key={i}
				className="w-4"
				onClick={() => {
					props.onSelected(hour, i * 5);
				}}
			>
				{(i * 5).toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}
			</Button>,
		);
	}

	return (
		<div className="m-2">
			<div className="flex w-full justify-evenly gap-2">
				<span className="text-sm">Hour</span>
				<span className="text-sm">Min</span>
			</div>
			<Separator />
			<div className={`${styles.customScroll} flex h-32 justify-evenly gap-2`}>
				<div className="flex flex-col overflow-y-scroll">{hourElements}</div>
				<div className="flex flex-col overflow-y-scroll">{minuteElements}</div>
			</div>
		</div>
	);
}
