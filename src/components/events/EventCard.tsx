"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { GetLocalUserEventsType } from "@/actions/eventActions"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "lucide-react"
import { formatDateRange } from "@/utils/dateUtils"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"

interface Props {
	title: string
	description: string
	events?: GetLocalUserEventsType
}

export default function EventCard({ title, description, events }: Props) {
	const router = useRouter();
	return <Card className="flex flex-1 flex-col w-full max-w-[33%] mx-auto shadow-lg justify-between">
		<div>
			<CardHeader className="rounded-t-lg">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-1 p-6 overflow-hidden">
				{events?.map((event, index) => {
					return <div key={event.id}>
						{index > 0 && <Separator />}
						<button key={event.id} className="group flex hover:bg-gray-100 px-4 py-2 rounded-md" onClick={() => {
							router.push(`/events/${event.id}`)
						}}>
							<div className="flex gap-2 items-center h-12">
								<div className="flex items-center gap-2 w-40">
									<Avatar>
										<AvatarImage src={event.host.avatarUrl!} />
										<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
									</Avatar>
									<div className="truncate">{event.host.username}</div>
								</div>
								<Separator orientation="vertical" className="group-hover:bg-gray-300" />
								<div className="flex flex-col gap-2 items-start w-64">
									<span className="max-w-64 truncate">{event.title}</span>
									<span className="text-sm">Date: {formatDateRange(event.start, event.end)}</span>
								</div>
								<Separator orientation="vertical" className="group-hover:bg-gray-300" />
								<span>{event.status}</span>
							</div>
						</button>
					</div>
				})}
			</CardContent>
		</div>
	</Card>
}