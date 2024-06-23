"use client";
import React, { useEffect } from "react";
import { Dialog } from "./ui/dialog";
import { useQueryState } from "nuqs";

interface Props {
	children?: React.ReactNode;
	value: string;
}

export default function QueryDialog({ children, value }: Props) {
	const [dialogString, setDialogString] = useQueryState("dialog");

	const [isOpen, setIsOpen] = React.useState(false);

	useEffect(() => {
		setIsOpen(dialogString !== null && dialogString === value);
	}, [setIsOpen, dialogString, value]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open: boolean) => {
				if (!open) {
					setDialogString(null);
				}
			}}
		>
			{children}
		</Dialog>
	);
}
