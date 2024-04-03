"use client"
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Profile } from "@/db/schema"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { addFriend, getFriendsType } from "@/app/addfriend/actions";

interface Props {
	friends: getFriendsType
}

const formSchema = z.object({
	username: z.string(),
})


export default function FriendList({ friends }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		}
	});

	async function processForm(values: z.infer<typeof formSchema>) {
		await addFriend(values.username)
	}

	return (
		<div className="flex flex-col gap-4">
			<Form {...form} >
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
									<FormMessage />
									<Button type='submit'>Add</Button>
								</div>
							</FormItem>
						)}
					/>
				</form>
			</Form>

			<Separator />
			<Label>Friend list</Label>

			{friends !== undefined && friends.map((friendship) => {
				if (friendship.profile === undefined || friendship.profile === null) return;

				return <div key={friendship.id} className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<Avatar >
							<AvatarImage src={friendship.profile.avatarUrl ?? undefined} />
							<AvatarFallback>{friendship.profile.username!.substring(0, 2)}</AvatarFallback>
						</Avatar>
						{friendship.profile.username}
					</div>
					<Button size={"icon"} variant={"secondary"} className="hover:bg-red-500"><Trash /></Button>
				</div>
			})}
		</div>
	)
}




