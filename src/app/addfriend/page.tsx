import { addFriend, getUser, getOutgoingRequests, getIncomingRequests, getFriends } from "./actions";
import { Button } from "@/components/ui/button";
import AcceptButton from "@/components/friends/acceptButton";

export default async function AddFriend() {
	const user = await getUser();
	const outgoingRequests = await getOutgoingRequests();
	const IncomingRequests = await getIncomingRequests();
	const friends = await getFriends();

	return (
		<>
			<div>
				you are: {user?.username}
			</div>
			<br />
			<div>
				Add a friend
			</div>
			<form>
				<label htmlFor="username">Username:</label>
				<input id="username" name="username" type="text" required />
				<Button formAction={addFriend}>Add Friend</Button>
			</form>
			<br />
			<div>
				outgoing
			</div>
			<div>
				{outgoingRequests?.map((user) => {
					return <div key={`out-${user.id}`}>{user.username}</div>
				})}
			</div>
			<br />
			<div>
				incoming
			</div>
			<div>
				{IncomingRequests?.map((user) => {
					return <div key={`out-${user.id}`}>{user.username}<AcceptButton id={user.id} /></div>
				})}
			</div>
			<br />
			<div>
				friends
			</div>
			<div>
				{friends?.map((value) => {
					return <div key={`out-${value.id}`}>{value.username}</div>
				})}
			</div>
		</>
	);
}