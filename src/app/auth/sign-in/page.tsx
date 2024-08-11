import { buttonVariants } from "@/components/ui/button";
import { Google, Discord } from "@/utils/icons/icons";
import Link from "next/link";

export default function SignIn() {
	return (
		<div className="prose m-auto">
			<div className="flex flex-col items-center gap-2">
				<h3>Sign In to TimeLineup</h3>
				<p>Hello there, please sign in to continue</p>
			</div>
			<div className="mt-6 flex flex-col gap-2">
				<Link
					className={`${buttonVariants({ variant: "outline" })} not-prose flex justify-evenly gap-2`}
					href="/auth/google"
				>
					<Google />
					Continue with Google
				</Link>
				<Link
					className={`${buttonVariants({ variant: "outline" })} not-prose flex justify-evenly gap-2`}
					href="/auth/discord"
				>
					<Discord />
					Continue with Discord
				</Link>
			</div>
		</div>
	);
}
