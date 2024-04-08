'use client'
import { Button } from '@/components/ui/button'
import { FriendStatusAndProfile, acceptFriendRequest, friendRequest, removeFriend } from '@/actions/friendActions'
import { Check, User, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
	requests: FriendStatusAndProfile
	onClick: (id: string) => void;
}

export default function FriendRequests({ requests, onClick }: Props) {

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
							<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
						</Avatar>
						{request.profile.username}
					</div>
					<div className='flex items-center gap-4' >
						<Button size="icon" variant={"secondary"} className={"rounded-full w-6 h-6"} onClick={async () => {
							onClick(request.id);
							// setRequests(requests.filter(r => r.id !== request.id))
							await removeFriend(request.id);
						}}><X className='w-4 h-4' /></Button>

						<Button size="icon" variant={"default"} className={"rounded-full w-6 h-6"} onClick={async () => {
							onClick(request.id);
							// setRequests(requests.filter(r => r.id !== request.id))
							await acceptFriendRequest(request.id);
						}}><Check className='w-4 h-4' /></Button>
					</div>
				</div>
			})}
		</div>
	)
}