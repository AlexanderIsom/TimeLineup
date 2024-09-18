"use client"

import { usePathname } from "next/navigation";

export default function HideOnRoute({ children, route }: { children: React.ReactNode; route: string }) {
	const path = usePathname();
	return path.includes(route) ? null : children;
}