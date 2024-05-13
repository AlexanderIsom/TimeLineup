import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ManageFriends from "./manageFriends";

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function FriendsDialog({ open, onClose }: Props) {
	return <Dialog open={open} onOpenChange={(state) => {
		if (!state) {
			onClose();
		}
	}}>
		<DialogContent>
			<DialogHeader >
				<DialogTitle>Manage friends</DialogTitle>
			</DialogHeader>
			<ManageFriends />
		</DialogContent>
	</Dialog>
}