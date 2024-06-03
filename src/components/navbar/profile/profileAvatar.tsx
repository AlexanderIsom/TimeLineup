"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import useSWR from "swr";

interface Props {
	iconOnly?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProfileAvatar({ iconOnly }: Props = { iconOnly: false }) {
	const { data: profile } = useSWR("/api/profile", fetcher);

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
			<Avatar>
				<User />
			</Avatar>
			{!iconOnly && <span>Loading...</span>}
		</div>
	);
}
