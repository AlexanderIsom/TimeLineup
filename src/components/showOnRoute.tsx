"use client"

import { usePathname } from "next/navigation";

export default function ShowOnRoute({ children, route }: { children: React.ReactNode; route: string }) {
	const path = usePathname();
	return path.includes(route) ? children : null;
}