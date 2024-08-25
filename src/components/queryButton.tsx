"use client";
import { useQueryState } from "nuqs";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = ButtonProps & {
	children?: React.ReactNode;
	query: string;
	styled?: boolean;
	className?: string;
};

export default function QueryButton({ children, query, className, styled = true, ...props }: Props) {
	const [modalString, setModalString] = useQueryState("dialog");
	return (
		<Button
			{...props}
			onClick={() => {
				setModalString(query);
			}}
			className={cn(className)}
		>
			{children}
		</Button>
	);
}
