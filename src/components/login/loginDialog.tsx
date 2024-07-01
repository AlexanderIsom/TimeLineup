import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import ProviderButton from "./providerButton";
import QueryDialog from "../queryDialog";

export default function LoginDialog() {
	return (
		<QueryDialog dialogId="login">
			<DialogContent className="flex max-w-max flex-col rounded-lg">
				<DialogHeader className="flex">
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>hello there</DialogDescription>
				</DialogHeader>
				<ProviderButton provider="google">Sign in with Google</ProviderButton>
				<ProviderButton provider="discord">Sign in with Discord</ProviderButton>
			</DialogContent>
		</QueryDialog>
	);
}
