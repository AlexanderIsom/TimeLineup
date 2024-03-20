'use client'
import { Button } from '@/components/ui/button'
import { acceptFriendRequest } from '@/app/addfriend/actions'

interface Props {
	id: string
}

export default function AcceptButton({ id }: Props) {
	return (
		<Button onClick={() => {
			acceptFriendRequest(id);
		}}>Accept friend</Button>
	)
}