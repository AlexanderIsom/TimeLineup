"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSupabaseBrowser from "@/lib/supabase/browser";
import { Enums } from "@/lib/supabase/database.types";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

interface Props {
	rsvpId: number;
	defaultStatus: Enums<"rsvp_status">
}

export default function RsvpToggle({ rsvpId, defaultStatus }: Props) {
	const supabase = useSupabaseBrowser();
	const { mutateAsync: changeStatus } = useUpdateMutation(supabase.from("rsvp"), ["id"], "status")

	const onChange = (value: Enums<"rsvp_status">) => {
		changeStatus({ id: rsvpId, status: value })
	}


	return (
		<Select defaultValue={defaultStatus} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="pending">pending</SelectItem>
				<SelectItem value="attending">attending</SelectItem>
				<SelectItem value="declined">declined</SelectItem>
			</SelectContent>
		</Select>
	)
}