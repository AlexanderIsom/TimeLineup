import { Dialog, DialogDescription, DialogHeader, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileForm from "./profileForm";
import { useProfile } from "@/swr/swrFunctions";
import { User } from "lucide-react";

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: Props) {
	const { profile, isLoading, isError } = useProfile()
	if (isLoading || !profile) {
		return;
	}

	const avatar = isLoading ?
		<AvatarFallback><User /></AvatarFallback> :
		<>
			<AvatarImage src={profile.avatarUrl ?? undefined} />
			<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
		</>

	return <Dialog open={open} onOpenChange={(state: boolean) => {
		if (!state) {
			onClose()
		}
	}}>
		<DialogContent>
			<DialogHeader className='flex flex-col items-center space-y-2'>
				<div className="flex items-center space-x-2">
					<Avatar>
						{avatar}
					</Avatar>
					<span>
						{profile.username!}
					</span>
				</div>
				<DialogDescription>
					Change your profile picture and username here.
				</DialogDescription>
			</DialogHeader>
			<ProfileForm onCancel={onClose} />
		</DialogContent>
	</Dialog>
}