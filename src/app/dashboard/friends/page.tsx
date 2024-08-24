import AddFriendForm from "@/components/dashboard/friends/addFriendForm";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function Friends() {
	return <div className="p-4 prose space-y-4 min-w-full flex flex-col">
		<div>
			<h3 className="m-0">
				Friends
			</h3>
			<p className="m-0">
				see and manage your friends.
			</p>
		</div>
		<AddFriendForm />
		<Card className="w-full min-h-96">
			<div className="size-full flex flex-col gap-2 justify-center items-center text-center">
				<div className="bg-gray-200 rounded-full p-4">
					<UserPlus className="size-8" />
				</div>
				<div className="flex flex-col gap-1 text-center items-center justify-center">
					<h3 className="m-0">No friends</h3>
					<p className="m-0 text-wrap w-3/4">You havent added any friend, search for a user above or go to their profile to add them</p>
				</div>

			</div>
		</Card>

	</div>
}