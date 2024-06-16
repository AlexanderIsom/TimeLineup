import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ProviderButton from "./providerButton";

interface Props {
	children?: React.ReactNode;
}

export default function LoginDialog({ children }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="flex max-w-max flex-col rounded-lg">
				<DialogHeader className="flex">
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>hello there</DialogDescription>
				</DialogHeader>
				<ProviderButton provider="google">Sign in with Google</ProviderButton>
				<ProviderButton provider="discord">Sign in with Discord</ProviderButton>
			</DialogContent>
		</Dialog>
	);
}
