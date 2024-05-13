'use client'
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isUsernameAvaliable, updateUserProfile } from "@/actions/profileActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import DeleteProfile from "./deleteProfile";


const formSchema = z.object({
	username: z.string().min(6, {
		message: "Username must be at least 8 characters",
	}).or(z.literal('')),
	avatarUrl: z.string().url({ message: "Invalid Url" }).or(z.literal('')),
})

interface Props {
	onCancel?: () => void;
}

export default function ProfileForm({ onCancel }: Props) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			avatarUrl: "",
		}
	});

	async function processForm(values: z.infer<typeof formSchema>) {
		const updatedValues = { username: values.username === "" ? undefined : values.username, avatarUrl: values.avatarUrl === "" ? undefined : values.avatarUrl }
		if (updatedValues.username !== undefined) {
			const usernameAvaliable = await isUsernameAvaliable(updatedValues.username);
			if (!usernameAvaliable) {
				form.setError("username", { message: "Username is in use" })
				return;
			}
		}
		await updateUserProfile(updatedValues).then(() => {
			form.reset();
			router.refresh();
		})
	}

	return <Form {...form} >
		<form onSubmit={form.handleSubmit(processForm)} className="flex flex-col gap-2">
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
					<Button type='button' variant="outline" onClick={
						() => {
							form.reset();
							if (onCancel)
								onCancel();
						}
					}>Cancel</Button>
					<DeleteProfile />
				</div>
				<Button type='submit'>Update</Button>
			</div>
		</form>
	</Form >
}