"use client"
import { Button } from '@/components/ui/button'
import { acceptFriendRequest, friendRequest, removeFriend } from '@/actions/friendActions'
import { Check, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useState } from 'react'

interface Props {
	requests: Array<friendRequest> | undefined
}

export default function FriendRequests(props: Props) {
	const [requests, setRequests] = useState(props.requests);

	if (requests === undefined || requests.length <= 0) {
		return <h2 className="text-sm font-semibold">no pending friend requests</h2>
	}

	return (
		<div>
			{requests.map((request) => {
				return <div key={request.id} className='flex justify-between'>
					<div className='flex items-center gap-4'>
						<Avatar>
							<AvatarImage src={request.profile.avatarUrl ?? undefined} />
							<AvatarFallback>{request.profile.username!.substring(0, 2)}</AvatarFallback>
						</Avatar>
						{request.profile.username}
					</div>
					<div className='flex items-center gap-4' >
						<Button size="icon" variant={"secondary"} className={"rounded-full w-6 h-6"} onClick={async () => {
							setRequests(requests.filter(r => r.id !== request.id))
							await removeFriend(request.id);
						}}><X className='w-4 h-4' /></Button>

						<Button size="icon" variant={"default"} className={"rounded-full w-6 h-6"} onClick={async () => {
							setRequests(requests.filter(r => r.id !== request.id))
							await acceptFriendRequest(request.id);
						}}><Check className='w-4 h-4' /></Button>
					</div>
				</div>
			})}
		</div>
	)
}