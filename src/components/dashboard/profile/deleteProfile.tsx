import { deleteUserProfile } from "@/actions/profileActions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteProfile() {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button type="button" variant={"destructive"}>
					Delete account
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="w-11/12 rounded-lg">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete account ?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure this cannot be undone, this will delete all data associated and related to this
						account
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form>
						<AlertDialogAction formAction={deleteUserProfile} type="submit">
							Continue
						</AlertDialogAction>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
	return;
}
