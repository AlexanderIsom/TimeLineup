import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { getFriends } from "@/lib/supabase/queries/getFriends";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FriendsFormValues } from ".";

export default function FriendsForm() {
	const form = useFormContext<FriendsFormValues>();

	const supabase = useSupabaseBrowser();
	const { data: userProfiles, isLoading } = useQuery({
		queryKey: ["getCurrentFriends", supabase],
		queryFn: async () => {
			const { data: { user } } = await supabase.auth.getUser();
			const { data: friends } = await getFriends(supabase);

			if (!friends || !user) return [];
			const strippedProfiles = friends.filter((friend) => friend.status === "accepted").map((friend) => {
				return friend.receiving_user_profile!.id === user.id ? friend.sending_user_profile! : friend.receiving_user_profile!;
			}).sort((a, b) => a.username!.localeCompare(b.username!));

			return strippedProfiles;
		}
	})

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div>
			{userProfiles?.map((profile, index) => {
				return <div key={index} className="flex p-4 items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar >
							<AvatarImage src={profile?.avatar_url ?? undefined} />
							<AvatarFallback>
								<User />
							</AvatarFallback>
						</Avatar>
						{profile.username}
					</div>
					<Checkbox defaultChecked={form.getValues("invitees").includes(profile.id)} onCheckedChange={(checked) => {
						if (checked) {
							const values = form.getValues("invitees");
							values.push(profile.id);
							form.setValue("invitees", values)
						} else {
							form.setValue("invitees", form.getValues("invitees").filter((id) => id !== profile.id))
						}
					}} />
				</div>
			})}
		</div>
	)
}