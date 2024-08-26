"use client";

import { eachMinuteOfInterval, format, isSameMinute } from "date-fns";
import React from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
	children: React.ReactNode;
	start: Date;
	end: Date;
	selected: Date;
	onSelected: (date: Date) => void;
}

export default function TimeSelectorPopover({ children, start, end, selected, onSelected }: Props) {
	const elements = eachMinuteOfInterval({
		start,
		end
	}, { step: 15 });

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>

			<PopoverContent className="flex flex-col gap-2 overflow-y-scroll max-h-32 p-1 w-28" align="start">
				{elements.map((date, i) => {
					console.log(`DATE: ${date}, selected: ${selected}`)
					return <Button
						variant={isSameMinute(date, selected) ? "secondary" : "ghost"}
						key={i}
						onClick={() => {
							onSelected(date);
						}}
						className="p-1"
					>
						{format(date, "K:mmaaa")}
					</Button>
				})}
			</PopoverContent>
		</Popover>

	);
}
