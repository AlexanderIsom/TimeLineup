import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Plus } from "lucide-react";

export default function Availability() {
	return <section className="p-4 prose min-w-full flex flex-col gap-8">
		<div className="flex justify-between items-center">
			<div>
				<h3 className="my-0">Availability</h3>
				<p className="mb-0">configure times when you are availabile for events</p>
			</div>
			<Button variant={"secondary"} className="flex gap-2">
				<Plus className="size-4" /> New
			</Button>
		</div>

		<Card className="w-full min-h-32">
			<div className="size-full flex flex-col gap-2 justify-center items-center text-center p-8">
				<div className="bg-gray-200 rounded-full p-4">
					<Clock className="size-8" />
				</div>
				<div className="flex flex-col gap-1 text-center items-center justify-center">
					<h3 className="m-0">No availability</h3>
					<p className="m-0 text-wrap w-3/4">You havent set any availability, press the + new button to set your availability</p>
				</div>

			</div>
		</Card>

	</section>
}