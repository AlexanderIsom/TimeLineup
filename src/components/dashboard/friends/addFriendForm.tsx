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
		await addFriendByName(values.username);
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
							<FormControl>
								<Input placeholder="Username" {...field} className="min-w-64" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Add</Button>
			</form>
		</Form>
	</div>
}