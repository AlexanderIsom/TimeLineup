"use client"

import { addFriendByName } from "@/actions/friendActions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
	username: z.string().min(5, { message: "Event title must be at least 5 characters." })
})

export default function AddFriendForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { success, error } = await addFriendByName(values.username);
		if (!success && error !== undefined) {
			form.setError("username", { message: error })
		}
	}

	return <div>
		<Form {...form}>
			<form className="flex items-end gap-2" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Add a friend via username</FormLabel>
							<div className="flex gap-2">
								<FormControl>
									<Input placeholder="Username" {...field} className="min-w-64" />
								</FormControl>
								<Button type="submit">Add</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

			</form>
		</Form>
	</div>
}