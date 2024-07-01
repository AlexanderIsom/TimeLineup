"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Drawer } from "./ui/drawer";

interface Props {
	children: React.ReactNode;
	drawerId: string;
}

export default function QueryDrawer({ children, drawerId }: Props) {
	const [modalString, setModalString] = useQueryState("modal");

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(modalString !== null && modalString === drawerId);
	}, [setIsOpen, modalString, drawerId]);

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
