"use client";
import { getUserProfile } from "@/actions/profileActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import useSWR from "swr";

interface Props {
	iconOnly?: boolean;
}

export function ProfileAvatar({ iconOnly }: Props = { iconOnly: false }) {
	const { data: profile, isLoading, error } = useSWR("/api/profile", getUserProfile);

	if (isLoading || error) {
		return <ProfileAvatarFallback iconOnly={iconOnly} />;
	}

	return (
		<div className="flex items-center space-x-2">
			<Avatar>
				<AvatarImage src={profile?.avatarUrl ?? undefined} />
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
