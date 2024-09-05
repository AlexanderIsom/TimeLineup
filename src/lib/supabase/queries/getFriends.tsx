import { TypedSupabaseClient } from "@/utils/types";

export function getFriends(client: TypedSupabaseClient) {
	return client.from("friendship").select("*, sending_user_profile:profile!public_friendships_user_1_fkey(*),receiving_user_profile:profile!public_friendships_user_2_fkey(*)")
}

export function acceptFriendRequest(client: TypedSupabaseClient, id: string) {
	return client.from("friendship").update({ status: "accepted" }).eq("id", id)
}

export function deleteFriendRequest(client: TypedSupabaseClient, id: string) {
	return client.from("friendship").delete().eq("id", id)
}

export function getFriendById(client: TypedSupabaseClient, id: string) {
	return client.from("friendship").select("status").or(`sending_user.eq.${id}, receiving_user.eq.${id}`).single();
}