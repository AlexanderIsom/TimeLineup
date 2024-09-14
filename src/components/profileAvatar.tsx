import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentProfile } from "@/lib/session";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface Props {
	iconOnly?: boolean;
	className?: string;
	profile: Tables<"profile">;
}

const defaultProps: Partial<Props> = {
	iconOnly: false,
}

export async function ProfileAvatar(props: Props) {
	const { profile, iconOnly, className } = { ...defaultProps, ...props };

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Avatar className="size-full">
				<AvatarImage src={profile.avatar_url ?? undefined} />
				<AvatarFallback className="bg-gray-200">
					<User />
				</AvatarFallback>
			</Avatar>
			{!iconOnly && <span>{profile?.username}</span>}
		</div>
	);
}