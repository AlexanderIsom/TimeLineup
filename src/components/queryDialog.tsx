"use client";
import React, { useEffect } from "react";
import { Dialog } from "./ui/dialog";
import { useSearchParams } from "next/navigation";

interface Props {
	children?: React.ReactNode;
	query: string;
	value: string;
}

export default function QueryDialog({ children, query, value }: Props) {
	const searchParams = useSearchParams();
	const dialogString = searchParams?.get(query);

	const removeQueryFromUrl = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete(query);
		window.history.replaceState(null, "", `?${params.toString()}`);
	};

	const [isOpen, setIsOpen] = React.useState(false);

	useEffect(() => {
		setIsOpen(dialogString !== null && dialogString === value);
	}, [setIsOpen, dialogString, value]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open: boolean) => {
				if (!open) {
					removeQueryFromUrl();
				}
			}}
		>
			{children}
		</Dialog>
	);
}
