"use client"
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Props {
	path: string;
}

export default function CopyProfileLink({ path }: Props) {
	return (
		<Button variant={"ghost"} className="flex gap-2 justify-start text-gray-900" onClick={() => {
			navigator.clipboard.writeText(path)
			toast("Link coppied to clipboard")
		}}>
			<Copy className="size-5" />
			copy profile page link
		</Button>
	)
}