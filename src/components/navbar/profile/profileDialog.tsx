"use client"
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileForm from "./profileForm";
import { useProfile } from "@/swr/swrFunctions";
import { User } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
}

export default function ProfileDialog({ children, open, onClose }: Props) {
	const { profile, isLoading, isError } = useProfile()
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const avatar = isLoading ?
		<AvatarFallback><User /></AvatarFallback> :
		<>
			<AvatarImage src={profile?.avatarUrl ?? undefined} />
			<AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
		</>

	if (isDesktop) {
		return <Dialog open={open} onOpenChange={(state: boolean) => {
			if (!state) {
				onClose?.();
			}
		}} >
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md px-4 md:px-6">
				<DialogHeader className='flex flex-col items-center space-y-2'>
					<div className="flex items-center space-x-2">
						<Avatar>
							{avatar}
						</Avatar>
						<span>
							{profile?.username}
						</span>
						hello
					</div>
					<DialogDescription>
						Change your profile picture and username here.
					</DialogDescription>
				</DialogHeader>
				<ProfileForm />
			</DialogContent>
		</Dialog>
	}

	return (
		<Drawer open={open} onOpenChange={(state: boolean) => {
			if (!state) {
				onClose?.();
			}
		}} >
			<DrawerTrigger asChild>
				{children}
			</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader>
					<div className="flex items-center justify-center space-x-2">
						<Avatar>
							{avatar}
						</Avatar>
						<span>
							{profile?.username}
						</span>
						hello
					</div>
					<DrawerDescription>Change your profile picture and username here.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm />
			</DrawerContent>
		</Drawer >
	)
}