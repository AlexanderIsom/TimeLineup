"use client";

import { eachMinuteOfInterval, endOfDay, format } from "date-fns";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import React, { useEffect, useRef } from "react";

interface Props {
	children: React.ReactNode;
	start: Date;
	value: Date;
	onSelected: (date: Date) => void;
}

export default function TimeSelectorPopover({ children, start, value, onSelected }: Props) {
	const elements = eachMinuteOfInterval({
		start,
		end: endOfDay(start)
	}, { step: 15 });

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>

			<PopoverContent className="w-auto flex flex-col gap-2 overflow-y-scroll max-h-32 p-1 w-28" align="start">
				{elements.map((date, i) => {
					return <Button
						variant={date === value ? "default" : "ghost"}
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
