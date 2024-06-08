"use client";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { ProfileAvatar } from "./profileAvatar";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteUserProfile, isUsernameAvaliable, updateUserProfile } from "@/actions/profileActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
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

interface Props {
	children?: React.ReactNode;
	dialogProps?: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	};
}

const formSchema = z.object({
	username: z
		.string()
		.min(6, {
			message: "Username must be at least 8 characters",
		})
		.or(z.literal("")),
	avatarUrl: z.string().url({ message: "Invalid Url" }).or(z.literal("")),
});

interface Props {
	onCancel?: () => void;
}

export function ProfileDialog({ children, dialogProps }: Props) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog {...dialogProps}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="w-11/12 px-4 sm:max-w-md md:px-6">
					<DialogHeader className="flex flex-col items-center space-y-2">
						<ProfileAvatar />
						<DialogDescription>Change your profile picture and username here.</DialogDescription>
					</DialogHeader>
					<ProfileForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader className="flex flex-col items-center space-y-2">
					<ProfileAvatar />
					<DrawerDescription>Change your profile picture and username here.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm />
			</DrawerContent>
		</Drawer>
	);
}

function ProfileForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			avatarUrl: "",
		},
	});

	async function processForm(values: z.infer<typeof formSchema>) {
		const updatedValues = {
			username: values.username === "" ? undefined : values.username,
			avatarUrl: values.avatarUrl === "" ? undefined : values.avatarUrl,
		};
		if (updatedValues.username !== undefined) {
			const usernameAvaliable = await isUsernameAvaliable(updatedValues.username);
			if (!usernameAvaliable) {
				form.setError("username", { message: "Username is in use" });
				return;
			}
		}
		await updateUserProfile(updatedValues).then(() => {
			form.reset();
			router.refresh();
		});
	}

	return (
		<Form {...form}>
			<form className="flex flex-col gap-2">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="avatarUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Avatar url</FormLabel>
							<FormControl>
								<Input type="url" placeholder="Url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between">
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								form.reset();
							}}
							className="hidden md:flex"
						>
							Cancel
						</Button>
						<DeleteProfile />
					</div>
					<Button onClick={form.handleSubmit(processForm)}>Update</Button>
				</div>
			</form>
		</Form>
	);
}

function DeleteProfile() {
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
