"use client";
import { useQueryState } from "nuqs";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = ButtonProps & {
	children?: React.ReactNode;
	value: string;
	styled?: boolean;
	className?: string;
};

export default function QueryButton({ children, value, className, styled = true, ...props }: Props) {
	const [modalString, setModalString] = useQueryState("modal");
	if (styled) {
		return (
			<Button
				{...props}
				onClick={() => {
					setModalString(value);
				}}
				className={cn(className)}
			>
				{children}
			</Button>
		);
	}

	return (
		<button
			className={cn(className)}
			onClick={() => {
				setModalString(value);
			}}
		>
			{children}
		</button>
	);
}
