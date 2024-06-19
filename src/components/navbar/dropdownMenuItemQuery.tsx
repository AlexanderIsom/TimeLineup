"use client";

import React from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Props {
	children: React.ReactNode;
	query: string;
	className?: string;
}

export default function DropdownMenuItemQuery({ children, className, query }: Props) {
	return (
		<DropdownMenuItem
			className={cn(className)}
			onSelect={() => {
				window.history.pushState({}, "", query);
			}}
		>
			{children}
		</DropdownMenuItem>
	);
}
