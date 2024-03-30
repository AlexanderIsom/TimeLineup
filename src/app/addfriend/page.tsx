import { addFriend, getUser, getOutgoingRequests, getIncomingRequests, getFriends } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default async function AddFriend() {
	const user = await getUser();
	const outgoingRequests = await getOutgoingRequests();
	const data = await getFriends();
	const friends = data?.success

	return (
		<div className="flex flex-col w-80">
			<div>
				you are: {user?.username}
			</div>
			<br />
			<Separator />

			<form >
				<div className="flex flex-col gap-4">
					<div>
						Add a friend
					</div>
					<div>
						<Label htmlFor="username">Username:</Label>
						<Input id="username" name="username" type="text" required />
					</div>
					<div className="flex justify-end">
						<Button formAction={addFriend}>Add Friend</Button>
					</div>
				</div>
			</form >
			<br />
			<Separator />

			<div>
				outgoing
			</div>
			<div>
				{(outgoingRequests !== undefined && outgoingRequests.length > 0) ? outgoingRequests?.map((user) => {
					return <div key={`out-${user.id}`}>{user.username}</div>
				}) : <span>none</span>}
			</div>
			<br />
			<Separator />

			<div>
				friends
			</div>
			<div>
				{(friends !== undefined && friends.length > 0) ? friends?.map((value) => {
					return <div key={`out-${value.id}`}>{value.username}</div>
				}) : <span>none</span>}
			</div>
		</div >
	);
}