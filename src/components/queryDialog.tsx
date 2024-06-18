"use client";
import React from "react";
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
		window.history.pushState(null, "", `?${params.toString()}`);
	};

	return (
		<Dialog
			open={dialogString !== null && dialogString === value}
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
