import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/db/schema";
import React from "react";

interface Props {
	list: Array<Profile>;
	icon: React.ReactNode;
	onClick: (profile: Profile) => void;
}

export default function FriendSelector({ list, icon, onClick }: Props) {

	return <div className="max-h-[300px] overflow-y-auto">
		{list.map((user) => {
			return <div key={user.id} className='flex items-center gap-4 hover:bg-gray-100 rounded-md p-2 justify-between'>
				<div className='flex items-center gap-4'>
					<Avatar >
						<AvatarImage src={user.avatarUrl ?? undefined} />
						<AvatarFallback>{user.username!.substring(0, 2)}</AvatarFallback>
					</Avatar>
					{user.username}
				</div>
				<Button size={"icon"} variant={"default"} className="hover:bg-blue-600 h-8 w-8" onClick={() => {
					onClick(user);
				}}>{icon}</Button>
			</div>
		})}
	</div>
}