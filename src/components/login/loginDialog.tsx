import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import ProviderButton from "./providerButton";

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function LoginDialog({ open, onClose }: Props) {

	return (
		<Dialog open={open} onOpenChange={(state: boolean) => {
			if (!state) {
				onClose();
			}
		}}>
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