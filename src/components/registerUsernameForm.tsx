import { isUsernameAvaliable, updateUserProfile } from "@/actions/profileActions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	username: z.string(),
});

interface props {
	onSuccess: () => void;
}

export default function RegisterUsernameForm({ onSuccess }: props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

	const router = useRouter();

	async function processForm(values: z.infer<typeof formSchema>) {
		const updatedValues = {
			username: values.username === "" ? undefined : values.username,
		};
		if (updatedValues.username !== undefined) {
			const usernameAvaliable = await isUsernameAvaliable(updatedValues.username);
			if (!usernameAvaliable) {
				form.setError("username", { message: "Username is in use" });
				return;
			}
		}
		await updateUserProfile(updatedValues).then(() => {
			onSuccess();
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(processForm)} className="flex gap-2">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="w-full">
							<div className="flex gap-2">
								<FormControl>
									<Input type="text" placeholder="Username" {...field} className="w-full" />
								</FormControl>
								<Button type="submit">Submit</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
