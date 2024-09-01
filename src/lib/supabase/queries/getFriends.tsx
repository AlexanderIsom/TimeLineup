import { getUser } from "@/lib/session";
import { Enums } from "@/utils/database.types";
import { TypedSupabaseClient } from "@/utils/types";

export async function getFriendsWithStatus(client: TypedSupabaseClient, status?: Enums<"friendship_status">) {
	return await client.from("friendship").select("*").or(`sending_user.eq`)
}

export async function getFriendById(client: TypedSupabaseClient, id: string) {
	const user = await getUser(client);
	const { data } = await client.from("friendship").select("status").or(`and(sending_user.eq.${id},receiving_user.eq.${user?.id}), and(sending_user.eq.${user?.id}, receiving_user.eq.${id})`).single()
	return data;
}