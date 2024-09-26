import { buttonVariants } from "@/components/ui/button";
import { Google, Github } from "@/utils/icons/icons";
import Link from "next/link";

export default function SignIn() {
	return (
		<div className="flex w-full h-full">
			<div className="prose mx-auto mt-[10vh]">
				<div className="flex flex-col items-center gap-2 text-center">
					<h3>Welcome to TimeLineup</h3>
					<p>Hello there, please use one of the links below to continue</p>
				</div>
				<div className="mt-6 flex flex-col gap-2 items-center">
					<Link
						className={`${buttonVariants({ variant: "outline" })} not-prose flex justify-center gap-2 w-56`}
						href="/auth/google"
					>
						<Google />
						Continue with Google
					</Link>
					<Link
						className={`${buttonVariants({ variant: "outline" })} not-prose flex justify-center gap-2 w-56`}
						href="/auth/github"
					>
						<Github />
						Continue with Github
					</Link>
				</div>
			</div>
		</div>
	);
}
