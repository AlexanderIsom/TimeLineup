import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getProfile, getUser } from "@/lib/session"
import { User } from "lucide-react"

export default async function ViewProfile({ params }: { params: { id: string } }) {
	const user = await getUser();
	const profile = await getProfile(params.id)
	return (
		<div className="w-full prose flex min-w-full">
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col text-center ">
				<Avatar className="size-32 not-prose">
					<AvatarImage src={profile?.avatar_url ?? undefined} />
					<AvatarFallback className="bg-gray-200">
						<User className="size-16" />
					</AvatarFallback>
				</Avatar>
				<h2>{profile?.username}</h2>
				{user && <div>
					<Button>
						add friend
					</Button>
				</div>}
			</div>

		</div>
	)
}
