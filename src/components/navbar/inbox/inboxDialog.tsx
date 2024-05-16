import { InboxIcon } from "lucide-react";
import Inbox from "./inbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
	children?: React.ReactNode;
}

export default function InboxDialog({ children }: Props) {
	return <Dialog>
		<DialogTrigger asChild>
			{children}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader >
				<DialogTitle className="flex gap-2 items-center"><InboxIcon className="h-4 w-4" />
					Inbox</DialogTitle>
			</DialogHeader>
			<Inbox />
		</DialogContent>
	</Dialog >

}