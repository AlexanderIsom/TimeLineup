import { deleteProfile } from "@/actions/profileActions";
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
	async function deleteAccount() {
		await deleteProfile();
	}

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
						<div>
							Are you sure this cannot be undone, this will delete all data associated and related to this
							account
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteAccount();
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
	return;
}
