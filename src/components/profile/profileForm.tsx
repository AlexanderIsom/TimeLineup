'use client'

import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { updateUserProfile } from "@/app/profile/actions";
import { useFormState, useFormStatus } from "react-dom";

export default function ProfileForm() {
	const [errorMessage, dispatch] = useFormState(updateUserProfile, undefined)
	const { pending } = useFormStatus()

	return <form action={dispatch}>
		<div className="grid w-full items-center gap-4">
			<div className="flex flex-col space-y-1.5">
				<Label htmlFor="username">Username</Label>
				<Input id="username" name="username" placeholder="Username" pattern="[A-Za-z0-9]{3,}" title="Username must be at least 3 characters long and contain only letters and numbers." />
			</div>
			<div className="flex flex-col space-y-1.5">
				<Label htmlFor="url">Avatar url</Label>
				<Input id="url" name="url" placeholder="https://" type="text" />
			</div>
			<div>{errorMessage !== undefined && <p>{errorMessage}</p>}</div>
			<div className="flex justify-between">
				<Link href={"/events"}>
					<Button variant="outline">Cancel</Button>
				</Link>
				<Button disabled={pending} type='submit'>Update</Button>
			</div>
		</div>
	</form>
}