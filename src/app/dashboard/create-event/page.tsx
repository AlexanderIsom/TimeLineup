"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
	title: z.string().min(5, { message: "Event title must be at least 5 characters." })
})

export default function CreateEvent() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: ""
		}
	})
	return <div className="p-4 prose min-w-full flex flex-col gap-8">
		<div className="flex flex-col">
			<h3 className="m-0">Create event</h3>
			<p className="m-0">create events and invite friends</p>
		</div>

		<Form {...form}>
			<form className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Title" {...field} />
							</FormControl>
							<FormDescription>
								Title of your Event.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>

		</Form>
	</div>
}