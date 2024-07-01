"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "./ui/dialog";
import { useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
	children?: React.ReactNode;
	dialogId: string;
}

export default function QueryDialog({ children, dialogId }: Props) {
	const [modalString, setModalString] = useQueryState("modal");

	const [isOpen, setIsOpen] = useState(false);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	useEffect(() => {
		setIsOpen(modalString !== null && modalString === dialogId);
	}, [setIsOpen, modalString, dialogId]);

	if (!isDesktop) {
		return null;
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open: boolean) => {
				if (!open) {
					setModalString(null);
				}
			}}
		>
			{children}
		</Dialog>
	);
}
