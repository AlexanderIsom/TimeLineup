"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Drawer as VDrawer } from "vaul";
import { Textarea } from "@/components/ui/textarea";

export default function Test() {
	return (
		<div className="h-full">
			<Card className="flex mx-4 mt-2 p-4 gap-2 items-center align-middle">
				<ShadcnDrawerWithTextArea />
				<VaulDrawerWithTextArea />
			</Card>
		</div >
	);
}

function ShadcnDrawerWithTextArea() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button size={"lg"}>Shad drawer</Button>
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

function VaulDrawerWithTextArea() {
	return (
		<VDrawer.Root >
			<VDrawer.Trigger><Button size={"lg"}>Vaul drawer</Button></VDrawer.Trigger>
			<VDrawer.Portal>
				<VDrawer.Overlay className="fixed inset-0 bg-black/40" />
				<VDrawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
					<div className="p-4 bg-white rounded-t-[10px] flex-1">
						<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
						<div className="max-w-md mx-auto">
							<VDrawer.Title className="font-medium mb-4 text-xl">Vaul drawer</VDrawer.Title>
							<Textarea placeholder="Description" className="resize-none" />
						</div>
					</div>
					<div className="p-4 h-4 bg-zinc-100 border-t border-zinc-200 mt-auto">

					</div>
				</VDrawer.Content>
				<VDrawer.Overlay />
			</VDrawer.Portal>
		</VDrawer.Root >
	)
}