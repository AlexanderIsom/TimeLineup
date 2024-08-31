import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Profile() {
	return <div className="flex grow flex-col gap-4 p-4 prose min-w-full">
		<div>
			<h3 className="m-0">
				Profile
			</h3>
			<p className="m-0">
				Update your profile image, username or bio here
			</p>
		</div>

		<div className="mx-auto mt-10 w-96">
			<div className="flex flex-col items-center gap-2">
				<Skeleton className="size-32 rounded-full" />
				<div className="h-12 w-1/2 mt-2 mb-6 flex">
					<Skeleton className="m-auto h-6 w-full" />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<Label>Username</Label>
				<Input type="text" placeholder="Username" disabled />
				<Label>Avatar url</Label>
				<Input type="text" placeholder="Url" disabled />
				<div className="flex justify-between">
					<div className="flex gap-2">
						<Button variant={"destructive"} disabled>Delete account</Button>
					</div>
					<Button disabled>Update</Button>
				</div>
			</div>
		</div>
	</div>
}