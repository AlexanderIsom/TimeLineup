import EventCardSkeleton from "@/components/events/EventCardSkeleton";

export default function Loading() {
	return (
		<div className="flex grow flex-col gap-4 p-4">
			<div className="flex grow flex-col gap-4 md:flex-row">
				<EventCardSkeleton title={"Next 7 days"} description="Events over the next week." />
				<EventCardSkeleton title={"Upcoming"} description="Future events." />
				<EventCardSkeleton title={"Last 14 days"} description="Past events from the last 2 weeks." />
			</div>
		</div>
	);
}
