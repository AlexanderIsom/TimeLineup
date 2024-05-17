import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ManageFriends from "./manageFriends";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

export default function FriendsDialog({ open, onClose, children }: Props) {
	return <Dialog open={open} onOpenChange={(state) => {
		if (!state) {
			onClose?.();
		}
	}}>
		<DialogTrigger asChild>
			{children}
		</DialogTrigger>
		<DialogContent className="w-11/12 sm:max-w-md">
			<DialogHeader >
				<DialogTitle className="flex gap-2 items-center">Manage friends</DialogTitle>
			</DialogHeader>
			<ManageFriends />
		</DialogContent>
	</Dialog>
}