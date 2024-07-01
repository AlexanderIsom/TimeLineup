"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Drawer } from "./ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
	children: React.ReactNode;
	drawerId: string;
}

export default function QueryDrawer({ children, drawerId }: Props) {
	const [modalString, setModalString] = useQueryState("modal");

	const [isOpen, setIsOpen] = useState(false);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	useEffect(() => {
		setIsOpen(modalString !== null && modalString === drawerId);
	}, [setIsOpen, modalString, drawerId]);

	if (isDesktop) {
		return null;
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => {
				setModalString(null);
			}}
		>
			{children}
		</Drawer>
	);
}
