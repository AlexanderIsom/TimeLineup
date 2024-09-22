"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useSupabaseBrowser from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface Props {
	eventId: number
}

export default function DeleteButton({ eventId }: Props) {
	const supabase = useSupabaseBrowser();
	const router = useRouter();

	const deleteEvent = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await supabase.from("event").delete().eq("id", eventId);
		router.push("/dashboard/events");
	}

	return <AlertDialog>
		<AlertDialogTrigger asChild>
			<Button variant={"destructive"} className="w-fit">Delete</Button>
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you sure ?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete this event
				</AlertDialogDescription>
			</AlertDialogHeader>
			<form onSubmit={deleteEvent}>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction type="submit">Continue</AlertDialogAction>
				</AlertDialogFooter>
			</form>
		</AlertDialogContent>
	</AlertDialog>
}