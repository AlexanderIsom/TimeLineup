import { addFriendById } from "@/actions/friendActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getProfile, getUser } from "@/lib/session"
import { getFriendById } from "@/lib/supabase/queries/getFriends";
import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react"

export default async function ViewProfile({ params }: { params: { id: string } }) {
	const supabase = createClient()
	const profile = await getProfile(params.id);
	// const [user, profile, friendship] = await Promise.all([
	// 	await getUser(),
	// 	await getProfile(params.id),
	// 	await getFriendById(supabase, params.id),
	// ])
	// const addFriend = async () => {
	// 	"use server"
	// 	await addFriendById(supabase, params.id);
	// 	console.log("added friend");
	// }
	return (
		<div className="w-full prose flex min-w-full">
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
				<Avatar className="size-32 not-prose">
					<AvatarImage src={profile?.avatar_url ?? undefined} />
					<AvatarFallback className="bg-gray-200">
						<User className="size-16" />
					</AvatarFallback>
				</Avatar>
				<h2>{profile?.username}</h2>
				{/* {user && !friendship && <form action={addFriend}>
					<Button type="submit">
						add friend
					</Button>
				</form>
				} */}
			</div>

		</div>
	)
}
