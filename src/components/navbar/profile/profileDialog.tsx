import { getUserProfile } from "@/actions/profileActions";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileForm from "./profileForm";

interface Props {
	open: boolean;
}

export default async function ProfileDialog({ open }: Props) {
	let profile = await getUserProfile();

	return <Dialog open={open}>
		<DialogContent>
			<DialogHeader className='flex flex-col items-center space-y-2'>
				<div className="flex items-center space-x-2">
					<Avatar >
						<AvatarImage src={profile!.avatarUrl ?? undefined} />
						<AvatarFallback>{profile!.username!.substring(0, 2)}</AvatarFallback>
					</Avatar>
					<span>
						{profile!.username!}
					</span>
				</div>
				<DialogDescription>
					Change your profile picture and username here.
				</DialogDescription>
			</DialogHeader>
			<ProfileForm />
		</DialogContent>
	</Dialog>
}