import useSupabaseBrowser from "@/lib/supabase/browser";
import { getFriends } from "@/lib/supabase/queries/getFriends";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function FriendsForm() {
	const supabase = useSupabaseBrowser();
	const { data: friends } = useQuery(getFriends(supabase))

	return (
		<div>EventFriendsForm</div>
	)
}