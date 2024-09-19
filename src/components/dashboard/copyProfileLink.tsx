"use client"
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
	path: string;
	className?: string;
	children?: React.ReactNode;
}

export default function CopyProfileLink({ path, className, children }: Props) {
	return (
		<Button variant={"ghost"} className={cn("flex gap-2 justify-start text-gray-900", className)} onClick={() => {
			navigator.clipboard.writeText(path)
			toast("Link coppied to clipboard")
		}}>
			{children}
		</Button>
	)
}