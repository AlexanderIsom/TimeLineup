
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { GetLocalUserEventsType } from "@/actions/eventActions"
import { Skeleton } from "../ui/skeleton"
import { Separator } from "../ui/separator"

interface Props {
	title: string
	description: string
	events?: GetLocalUserEventsType
}

export default function EventCardSkeleton({ title, description }: Props) {
	return <Card className="flex flex-col w-full mx-auto shadow-lg justify-between">
		<div>
			<CardHeader className="rounded-t-lg">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-1 p-6 h-8">
				<Skeleton className="h-4 w-[250px]" />
				<div className="group flex hover:bg-gray-100 px-4 py-2 rounded-md">
					<div className="flex gap-2 items-center h-12">
						<div className="flex items-center gap-2 w-32">
							<Skeleton className="h-12 w-12 rounded-full" />
						</div>
						<Separator orientation="vertical" className="group-hover:bg-gray-300" />
						<div className="flex flex-col gap-2 items-start min-w-64">
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
}