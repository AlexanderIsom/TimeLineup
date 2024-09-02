import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentProfile } from "@/lib/session";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface Props {
	iconOnly?: boolean;
	className?: string;
}

export async function ProfileAvatar({ iconOnly, className }: Props = { iconOnly: false }) {
	const { profile, user } = await getCurrentProfile();

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Avatar>
				<AvatarImage src={profile?.avatar_url ?? undefined} />
				<AvatarFallback className="bg-gray-200">
					<User />
				</AvatarFallback>
			</Avatar>
			{!iconOnly && <span>{profile?.username}</span>}
		</div>
	);
}

export function ProfileAvatarFallback({ iconOnly }: Props = { iconOnly: false }) {
	return (
		<div className="flex items-center space-x-2">
			<Avatar className="items-center justify-center bg-gray-200">
				<User />
			</Avatar>
			{!iconOnly && <span>Loading...</span>}
		</div>
	);
}
