import { redirect } from 'next/navigation'
import styles from "./profile.module.scss"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function PrivatePage() {
	const profile = await getUserProfile();

	if (profile === undefined) {
		redirect("/login")
	}

	return <div className='flex flex-col items-center gap-4 mt-32'>
		<Avatar className='w-16 h-16'>
			<AvatarImage src={profile.avatarUrl ?? undefined} />
			<AvatarFallback>{profile.username!.substring(0, 2)}</AvatarFallback>
		</Avatar>
		<p>Hello {profile?.username}</p>
		<Input placeholder='avartar url' className='w-64' />

		<Input placeholder='username' className='w-64' />
		<div className='flex gap-4'>
			<Button>Save</Button>
			<Button variant={"secondary"}>Cancel</Button>
		</div>
	</div>
}