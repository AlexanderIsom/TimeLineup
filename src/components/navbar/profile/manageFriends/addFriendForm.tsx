import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addFriend } from "@/actions/friendActions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	username: z.string(),
});

export default function AddFriendForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

	const router = useRouter();

	async function processForm(values: z.infer<typeof formSchema>) {
		const result = await addFriend(values.username);
		if (result && !result.success) {
			form.setError("username", { message: result.error }, { shouldFocus: true });
		}
		router.refresh();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(processForm)} className="flex gap-2">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>add by username</FormLabel>

							<div className="flex gap-2">
								<FormControl>
									<Input type="text" placeholder="Username" {...field} className="w-full" />
								</FormControl>
								<Button type="submit">Add</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
