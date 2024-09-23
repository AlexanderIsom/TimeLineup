"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Enums } from "@/lib/supabase/database.types"
import { getRsvps } from "@/lib/supabase/queries/getRsvps"
import { User } from "lucide-react"
import { useQueryState } from "nuqs"

const badgeStyles: { [key in Enums<"rsvp_status">]: string } = {
	"attending": "bg-green-500 text-black",
	"pending": "bg-yellow-500 text-black",
	"declined": "bg-red-500 text-black"
}

interface Props {
	rsvps: Awaited<ReturnType<typeof getRsvps>>['data']
}
export default function RsvpFilters({ rsvps }: Props) {
	const [filter, setFilter] = useQueryState("filter");

	const onChange = (value: string) => {
		if (value === "all") {
			setFilter(null)
			return
		}

		setFilter(value)
	}

	return (
		<Card className="p-4 h-full flex flex-col gap-2">
			<div className="hidden gap-2 md:flex">
				<Button variant={filter === null ? "secondary" : "ghost"} onClick={() => {
					setFilter(null)
				}}>All</Button>
				<Button variant={filter === "attending" ? "secondary" : "ghost"} onClick={() => {
					setFilter("attending")
				}}>Attending</Button>
				<Button variant={filter === "pending" ? "secondary" : "ghost"} onClick={() => {
					setFilter("pending")
				}}>Pending</Button>
				<Button variant={filter === "declined" ? "secondary" : "ghost"} onClick={() => {
					setFilter("declined")
				}}>Declined</Button>
			</div>
			<Select defaultValue={filter ?? "all"} onValueChange={onChange} value={filter ?? "all"}>
				<SelectTrigger className="w-full flex md:hidden">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="attending">Attending</SelectItem>
					<SelectItem value="pending">Pending</SelectItem>
					<SelectItem value="declined">Declined</SelectItem>
				</SelectContent>
			</Select>
			<Separator />
			<div className="h-full overflow-scroll flex flex-col gap-2 px-2">
				{rsvps?.filter((rsvp) => {
					if (filter === null) return true;
					return filter === rsvp.status;
				}).map((rsvp) => {
					return <div key={rsvp.id} className="flex gap-2 items-center">
						<Avatar className="not-prose size-14">
							<AvatarImage src={rsvp.user_profile?.avatar_url ?? undefined} />
							<AvatarFallback className="bg-gray-200">
								<User />
							</AvatarFallback>
						</Avatar>
						{rsvp.user_profile?.username}
						<Badge className={badgeStyles[rsvp.status]}>
							{rsvp.status}
						</Badge>
					</div>
				})}
			</div>
		</Card>)
}