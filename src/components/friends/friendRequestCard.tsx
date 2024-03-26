'use client'
import { Button } from '@/components/ui/button'
import { acceptFriendRequest, rejectFriendRequest } from '@/app/addfriend/actions'
import { Check, X } from 'lucide-react'
import { Profile } from '@/db/schema'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { profile } from 'console'

interface Props {
	user: Profile
}

export default function FriendRequestCard({ user }: Props) {
	return (
		<div className='flex justify-between'>
			<div className='flex items-center gap-4'>
				<Avatar>
					<AvatarImage src={user.avatarUrl ?? undefined} />
					<AvatarFallback>{user.username!.substring(0, 2)}</AvatarFallback>
				</Avatar>
				{user.username}
			</div>
			<div className='flex items-center gap-4' >
				<Button size="icon" variant={"secondary"} className={"rounded-full w-6 h-6"} onClick={() => {
					rejectFriendRequest(user.id);
				}}><X className='w-4 h-4' /></Button>

				<Button size="icon" variant={"default"} className={"rounded-full w-6 h-6"} onClick={() => {
					acceptFriendRequest(user.id);
				}}><Check className='w-4 h-4' /></Button>
			</div>
		</div>
	)
}