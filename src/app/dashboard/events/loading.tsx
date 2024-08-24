import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="flex grow flex-col gap-4 p-4 prose size-full min-w-full">
			<div>
				<h3 className="m-0">
					Events
				</h3>
				<p className="m-0">
					See your upcoming and past events
				</p>
			</div>
			<div className="flex gap-2">
				<Button variant={"secondary"} disabled>
					Upcoming
				</Button>
				<Button variant={"ghost"} disabled>
					Uncomfirmed
				</Button>
				<Button variant={"ghost"} disabled>
					Past
				</Button>
				<Button variant={"ghost"} disabled>
					Declined
				</Button>
			</div>


			<Card className="w-full min-h-96">

			</Card>
		</div>
	);
}
