import { InboxIcon } from "lucide-react";
import Inbox from "./inbox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface Props {
	children?: React.ReactNode;
}

export default function InboxDialog({ children }: Props) {
	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="h-1/2 px-4">
				<DrawerHeader>
					<DrawerTitle>Inbox</DrawerTitle>
				</DrawerHeader>
				<Inbox />
			</DrawerContent>
		</Drawer>
	);
}
