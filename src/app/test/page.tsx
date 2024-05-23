"use client"
import { Drawer } from "vaul";
import { Textarea } from "@/components/ui/textarea";



export default function Test() {
	return <VaulDrawerWithTextAreaLarge />
}

function VaulDrawerWithTextAreaLarge() {
	return (
		<Drawer.Root >
			<Drawer.Trigger asChild>
				<button >Vaul drawer Large</button>
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content className=" bg-white/50 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 max-h-[75%]">
					<div className="p-4">
						<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
						<Drawer.Title className="font-medium mb-4 text-xl">Vaul drawer Large</Drawer.Title>
					</div>
					<div className="w-full flex flex-col overflow-auto">
						<Textarea placeholder="Description" className="resize-none" />
						<Textarea placeholder="Description" className="resize-none" />
						<Textarea placeholder="Description" className="resize-none" />
						<Textarea placeholder="Description" className="resize-none" />
						<Textarea placeholder="Description" className="resize-none" />
						<Textarea placeholder="Description" className="resize-none" />
					</div>
				</Drawer.Content>
				<Drawer.Overlay />
			</Drawer.Portal>
		</Drawer.Root >
	)
}