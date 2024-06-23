"use client";

import React from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";

interface Props {
	children: React.ReactNode;
	dialogId: string;
	className?: string;
}

export default function DropdownDialogTrigger({ children, className, dialogId: value }: Props) {
	const [_, setQuery] = useQueryState("dialog", parseAsString.withOptions({ history: "replace" }));
	return (
		<DropdownMenuItem
			className={cn(className)}
			onSelect={() => {
				setQuery(value);
			}}
		>
			{children}
		</DropdownMenuItem>
	);
}
