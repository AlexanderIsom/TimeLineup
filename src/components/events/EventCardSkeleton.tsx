import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { GetLocalUserEventsType } from "@/actions/eventActions";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

interface Props {
	title: string;
	description: string;
	events?: GetLocalUserEventsType;
}

export default function EventCardSkeleton({ title, description }: Props) {
	return (
		<Card className="mx-auto flex w-full flex-col justify-between shadow-lg">
			<div>
				<CardHeader className="rounded-t-lg">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex h-8 flex-col gap-1 p-6">
					<Skeleton className="h-4 w-[250px]" />
					<div className="group flex rounded-md px-4 py-2 hover:bg-gray-100">
						<div className="flex h-12 items-center gap-2">
							<div className="flex w-32 items-center gap-2">
								<Skeleton className="h-12 w-12 rounded-full" />
							</div>
							<Separator orientation="vertical" className="group-hover:bg-gray-300" />
							<div className="flex min-w-64 flex-col items-start gap-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[250px]" />
							</div>
							<Separator orientation="vertical" className="group-hover:bg-gray-300" />
							<Skeleton className="h-4 w-[250px]" />
						</div>
					</div>
				</CardContent>
			</div>
		</Card>
	);
}
