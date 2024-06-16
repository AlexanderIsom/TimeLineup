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
		<Card className="mx-auto flex w-full flex-1 flex-col justify-between shadow-md md:max-w-[33%]">
			<div>
				<CardHeader className="rounded-t-lg">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex h-8 flex-col gap-1 p-6">
					<Skeleton className="h-4 w-[250px]" />
					<div className="flex flex-col gap-4 overflow-x-clip rounded-md px-4 py-2">
						<div className="flex h-12 w-full items-center gap-2">
							<div className="flex w-fit items-center gap-2">
								<Skeleton className="h-12 w-12 rounded-full" />
							</div>
							<Separator orientation="vertical" />
							<div className="flex min-w-64 flex-col items-start gap-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
							<Separator orientation="vertical" />
							<div className="flex-grow">
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
						<div className="flex h-12 w-full items-center gap-2">
							<div className="flex w-fit items-center gap-2">
								<Skeleton className="h-12 w-12 rounded-full" />
							</div>
							<Separator orientation="vertical" />
							<div className="flex min-w-64 flex-col items-start gap-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
							<Separator orientation="vertical" />
							<div className="flex-grow">
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					</div>
				</CardContent>
			</div>
		</Card>
	);
}
