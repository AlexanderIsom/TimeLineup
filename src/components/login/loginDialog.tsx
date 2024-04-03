
import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ProviderButton from "./providerButton";

interface Props {
	children: React.ReactNode;
}

export default function LoginDialog({ children }: Props) {

	return (
		<Dialog>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="flex flex-col max-w-max">
				<DialogHeader className="flex">
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>hello there</DialogDescription>
				</DialogHeader>
				<ProviderButton provider="google" >Login with Google</ProviderButton>
				<ProviderButton provider="discord" >Login with Discord</ProviderButton>
			</DialogContent>
		</Dialog>
	)
}