import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Enums } from "@/lib/supabase/database.types";

interface Props {
	status: Enums<"rsvp_status">
}

export default function RsvpToggle({ status }: Props) {
	return (
		<Select>
			<SelectTrigger className="w-[180px]">
				<SelectValue defaultValue={status} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="attending" className="flex gap-2">attending</SelectItem>
				<SelectItem value="pending">pending </SelectItem>
				<SelectItem value="declined">declined </SelectItem>
			</SelectContent>
		</Select>
	)
}