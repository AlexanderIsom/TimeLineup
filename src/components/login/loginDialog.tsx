import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import ProviderButton from "./providerButton";
import QueryDialog from "../queryDialog";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { Discord, Google } from "@/utils/icons/icons";

export default function LoginDialog() {
	return (
		<QueryDialog dialogId="login">
			<DialogContent className="flex max-w-max flex-col rounded-lg">
				<DialogHeader className="flex">
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>hello there</DialogDescription>
				</DialogHeader>
				<Link
					className={`${buttonVariants({ variant: "outline" })} flex justify-evenly gap-2`}
					href="/auth/google"
				>
					<Google />
					Sign in with Google
				</Link>
				<Link
					className={`${buttonVariants({ variant: "outline" })} flex justify-evenly gap-2`}
					href="/auth/discord"
				>
					<Discord />
					Sign in with Discord
				</Link>
				{/* <ProviderButton provider="google">Sign in with Google</ProviderButton>
				<ProviderButton provider="discord">Sign in with Discord</ProviderButton> */}
			</DialogContent>
		</QueryDialog>
	);
}
