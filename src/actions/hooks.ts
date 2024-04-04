import { useQuery } from "@tanstack/react-query";
import { getFriends } from "./friendActions";

export function useGetFriends() {
	return useQuery({
		queryFn: async () => getFriends(),
		queryKey: ["friends"]
	})
}