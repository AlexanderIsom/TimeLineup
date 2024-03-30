import { useQuery } from "@tanstack/react-query";
import { getFriends } from "./actions";

export function useGetFriends() {
	return useQuery({
		queryFn: async () => getFriends(),
		queryKey: ["friends"]
	})
}