"use client";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import RegisterUsernameForm from "./registerUsernameForm";
import { useRouter } from "next/navigation";

export default function RegisterUsernameModal() {
	const router = useRouter();
	const [modalString, setModalString] = useQueryState("modal");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(modalString !== null && modalString === "register");
	}, [setOpen, modalString]);

	return (
		<AlertDialog
			open={open}
			onOpenChange={(open: boolean) => {
				if (!open) {
					setModalString(null);
				}
			}}
		>
			<AlertDialogContent
				className="w-11/12 sm:max-w-md"
				onEscapeKeyDown={(event) => {
					event.preventDefault();
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">Choose your username</AlertDialogTitle>
					<AlertDialogDescription>This is how others will add you and must be unique</AlertDialogDescription>
				</AlertDialogHeader>
				<RegisterUsernameForm
					onSuccess={() => {
						router.push("/events");
						setOpen(false);
					}}
				/>
			</AlertDialogContent>
		</AlertDialog>
	);
}
