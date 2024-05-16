import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileForm from "./profileForm";
import { useProfile } from "@/swr/swrFunctions";
import { User } from "lucide-react";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

export default function ProfileDialog({ children, open, onClose }: Props) {
	const { profile, isLoading, isError } = useProfile()
	const avatar = isLoading ?
		<AvatarFallback><User /></AvatarFallback> :
		<>
			<AvatarImage src={profile?.avatarUrl ?? undefined} />
			<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
		</>

	return <Dialog open={open} onOpenChange={(state: boolean) => {
		if (!state) {
			onClose?.();
		}
	}} >
		<DialogTrigger asChild>
			{children}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader className='flex flex-col items-center space-y-2'>
				<div className="flex items-center space-x-2">
					<Avatar>
						{avatar}
					</Avatar>
					<span>
						{profile?.username}
					</span>
					hello
				</div>
				<DialogDescription>
					Change your profile picture and username here.
				</DialogDescription>
			</DialogHeader>
			<ProfileForm />
		</DialogContent>
	</Dialog>
}