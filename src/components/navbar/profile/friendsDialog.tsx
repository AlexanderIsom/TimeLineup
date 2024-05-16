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
		<DialogContent>
			<DialogHeader >
				<DialogTitle>Manage friends</DialogTitle>
			</DialogHeader>
			<ManageFriends />
		</DialogContent>
	</Dialog>
}