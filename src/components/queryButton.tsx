"use client";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { Button, ButtonProps } from "./ui/button";

type Props = ButtonProps & {
	children?: React.ReactNode;
	query: string;
	value: string | undefined;
	className?: string;
};

export default function QueryButton({ children, query, value, className, ...props }: Props) {
	const [modalString, setModalString] = useQueryState(query);
	return (
		<Button
			onClick={() => {
				if (!value) {
					setModalString(null);
				} else {
					setModalString(value);
				}
			}}
			className={cn(className)}
			{...props}
		>
			{children}
		</Button>
	);
}
