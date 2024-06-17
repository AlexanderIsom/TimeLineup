import { FriendStatusAndProfiles, acceptFriendRequest } from "@/actions/friendActions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WithoutArray } from "@/utils/TypeUtils";

import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";

interface FriendButtonProps {
	friendship: NonNullable<WithoutArray<FriendStatusAndProfiles>>;
	onRemoveFriend: (friend: NonNullable<WithoutArray<FriendStatusAndProfiles>>) => void;
}

export default function FriendButton({ friendship, onRemoveFriend }: FriendButtonProps) {
	const avatarString = friendship.profile.avatarUrl ?? "";
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={avatarString} />
					<AvatarFallback>{friendship.profile.username!.substring(0, 2)}</AvatarFallback>
				</Avatar>
				{
					<div className={`flex flex-col`}>
						<span>{friendship.profile.username}</span>
						{friendship.status === "pending" && (
							<span className="text-xs">{friendship.incoming ? "pending" : "waiting for response"}</span>
						)}
					</div>
				}
			</div>

			<div className="flex gap-2">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size={"icon"} variant={"secondary"} className="group hover:bg-red-500">
							{friendship.status === "pending" && friendship.incoming ? (
								<X className="group-hover:stroke-white" />
							) : (
								<Trash className="stroke-gray-700 group-hover:stroke-white" />
							)}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="w-11/12 rounded-md">
						<AlertDialogHeader>
							<AlertDialogTitle>Remove friend ?</AlertDialogTitle>
							<AlertDialogDescription>
								{friendship.status === "pending"
									? `Do you want to ${friendship.incoming ? "reject" : "cancel"} this friend request ?`
									: "Are you sure you want to remove this friend, you cannot invite them to events without re adding them"}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onRemoveFriend(friendship);
								}}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{friendship.status === "pending" && friendship.incoming && (
					<Button
						size={"icon"}
						variant={"secondary"}
						className="group hover:bg-blue-600"
						onClick={async () => {
							await acceptFriendRequest(friendship.id);
						}}
					>
						<Check className="stroke-gray-700 group-hover:stroke-white" />
					</Button>
				)}
			</div>
		</div>
	);
}
