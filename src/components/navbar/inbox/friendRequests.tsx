"use client"
import { Button } from '@/components/ui/button'
import { FriendStatusAndProfile, acceptFriendRequest, removeFriend } from '@/actions/friendActions'
import { Check, User, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useOptimistic } from 'react'

interface Props {
	requests: FriendStatusAndProfile
}

export default function FriendRequests(props: Props) {
	const [requests, removeRequest] = useOptimistic(props.requests, (state, requestIdToRemove) => {
		return state?.filter(({ id }) => id !== requestIdToRemove)
	});

	if (requests === undefined || requests.length <= 0) {
		return <h2 className="text-sm font-semibold">no pending friend requests</h2>
	}

	async function rejectRequest(id: string) {
		removeRequest(id);
		await removeFriend(id);
	}

	async function acceptRequest(id: string) {
		removeRequest(id);
		await acceptFriendRequest(id);
	}

	return (
		<div>
			{requests.map((request) => {
				return <div key={request.id} className='flex justify-between'>
					<div className='flex items-center gap-4'>
						<Avatar>
							<AvatarImage src={request.profile.avatarUrl ?? undefined} />
							<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
						</Avatar>
						{request.profile.username}
					</div>
					<form className='flex items-center gap-4' >
						<Button size="icon" variant={"secondary"} className={"rounded-full w-6 h-6"} formAction={() => {
							rejectRequest(request.id)
						}}><X className='w-4 h-4' /></Button>
						<Button size="icon" variant={"default"} className={"rounded-full w-6 h-6"} formAction={() => {
							acceptRequest(request.id)
						}}><Check className='w-4 h-4' /></Button>
					</form>
				</div>
			})}
		</div>
	)
}