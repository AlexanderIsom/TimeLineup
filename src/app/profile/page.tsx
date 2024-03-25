import { redirect } from 'next/navigation'
import styles from "./profile.module.scss"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserProfile, updateUserProfile } from './actions'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import ProfileForm from '@/components/profile/profileForm'

export default async function PrivatePage() {
	const profile = await getUserProfile();

	if (profile === undefined) {
		redirect("/login")
	}

	return <div className='flex justify-center mt-32'>
		<Card className="w-[350px]">
			<CardHeader className='flex flex-col items-center space-y-2'>
				<div className="flex items-center space-x-2">
					<Avatar>
						<AvatarImage src={profile.avatarUrl ?? undefined} />
						<AvatarFallback>{profile.username!.substring(0, 2)}</AvatarFallback>
					</Avatar>
					<span>
						{profile.username!}
					</span>
				</div>
				<CardDescription>Change your profile picture and username here.</CardDescription>
			</CardHeader>
			<CardContent>
				<ProfileForm />
			</CardContent>
		</Card>
	</div>
}