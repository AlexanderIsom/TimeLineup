import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";

export default function DrawerTextArea() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button size={"lg"}>Drawer test</Button>
			</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader>
					<DrawerTitle>test drawer</DrawerTitle>
				</DrawerHeader>
				<Textarea placeholder="Description" className="resize-none" />
			</DrawerContent>
		</Drawer >
	)
}