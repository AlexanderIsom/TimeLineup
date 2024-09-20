"use client"

import useSupabaseBrowser from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";

export default function NotificationBadge() {
	const supabase = useSupabaseBrowser();
	const { data } = useQuery({
		queryKey: ["getNotificationCount"],
		queryFn: async () => {
			const { count } = await supabase.from("notification").select('*', { count: 'exact', head: true })
			return count;
		},
		refetchInterval: 10000
	})

	return <Badge>{data}</Badge>

}