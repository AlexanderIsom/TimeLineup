"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventDataQuery, UpdateEvent, createEvent } from "@/actions/eventActions";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addMinutes, format, roundToNearestMinutes, subMinutes } from "date-fns";
import { CalendarIcon, Clock, LoaderCircle, Minus, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendSelector from "./friendSelector";
import { InsertEvent, Profile } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const steps = [
	{
		id: "Step 1",
		name: "Event details",
		fields: ["title", "startDate", "endDate", "description"],
	},
	{
		id: "Step 2",
		name: "Invite friends",
		fields: ["invitedFriends"],
	},
	{
		id: "Step 3",
		name: "Complete",
	},
];

interface Props {
	friendsList?: Array<Profile>;
	event?: EventDataQuery;
	isEditing?: boolean;
	children: React.ReactNode;
}

export default function CreateEventDialog({ friendsList, event, isEditing = false, children }: Props) {
	const formSchema = z
		.object({
			title: z.string().min(4, {
				message: "Title must be at least 4 characters",
			}),
			startDate: z
				.date({
					required_error: "date is required",
				})
				.refine((value) => value.valueOf() === event?.start.valueOf() || value >= new Date(), {
					message: "Cannot be in the past",
				}),
			endDate: z
				.date({
					required_error: "date is required",
				})
				.refine((value) => value.valueOf() === event?.end.valueOf() || value >= new Date(), {
					message: "Cannot be in the past",
				}),
			description: z.string().optional(),
		})
		.refine(
			(data) => {
				return data.endDate >= addMinutes(data.startDate, 30);
			},
			{ message: "Events must be at least 30 minutes long", path: ["endDate"] },
		);

	const [open, setOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [alertOpen, setAlertOpen] = useState(false);
	const [hasBeenWarned, setHasBeenWarned] = useState(false);
	const [startClockOpen, setStartClockOpen] = useState(false);
	const [endClockOpen, setEndClockOpen] = useState(false);
	const [invitedUsers, setInvitedUsers] = useState<Array<Profile>>(() => {
		if (event) {
			return event.rsvps.map((rsvp) => rsvp.user);
		}
		return [];
	});

	const isDesktop = useMediaQuery("(min-width: 768px)");

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: event !== undefined ? event.title : "",
			startDate:
				event !== undefined
					? event.start
					: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 5 }), 60),
			endDate:
				event !== undefined
					? event.end
					: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 5 }), 95),
			description: event !== undefined ? event.description : "",
		},
	});

	function processForm(values: z.infer<typeof formSchema>) {
		if (isEditing) {
			const data: NonNullable<EventDataQuery> = {
				...event,
				title: values.title,
				start: values.startDate,
				end: values.endDate,
				description: values.description,
			} as NonNullable<EventDataQuery>;
			UpdateEvent(data, invitedUsers).then(() => {
				setOpen(false);
				toast.message("Event has been updated", {
					description: format(data.start, "iiii, MMMM dd, yyyy 'at' h:mm aa"),
				});
				router.refresh();
			});
			return;
		} else {
			const data: InsertEvent = {
				title: values.title,
				start: values.startDate,
				end: values.endDate,
				description: values.description,
			} as InsertEvent;
			createEvent(data, invitedUsers).then((newEventId) => {
				setOpen(false);
				toast.message("Event has been created", {
					description: format(data.start, "iiii, MMMM dd, yyyy 'at' h:mm aa"),
					action: {
						label: "Goto",
						onClick: () => {
							router.push(`/events/${newEventId}`);
						},
					},
				});
				router.refresh();
			});
		}
	}

	type FieldName = keyof z.infer<typeof formSchema>;

	const next = async () => {
		const fields = steps[currentStep].fields;
		const output = await form.trigger(fields as FieldName[], { shouldFocus: true });

		if (!output) return;

		if (currentStep < steps.length - 1) {
			if (currentStep === steps.length - 2) {
				await form.handleSubmit(processForm)();
			}
			setCurrentStep((step) => step + 1);
		}
	};

	const prev = () => {
		if (currentStep > 0) {
			setCurrentStep((step) => step - 1);
		}
	};

	const resetForm = () => {
		form.reset();
		setCurrentStep(0);
		setInvitedUsers(() => {
			if (event) {
				return event.rsvps.map((rsvp) => rsvp.user);
			}
			return [];
		});
		form.setValue(
			"startDate",
			event !== undefined
				? event.start
				: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 5 }), 60),
		);
		form.setValue(
			"endDate",
			event !== undefined
				? event.end
				: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 5 }), 95),
		);
	};

	const addSelectedUser = (profile: Profile) => {
		setInvitedUsers((prevItems) => [...prevItems, profile]);
	};

	const removeSelectedUser = (profile: Profile) => {
		setInvitedUsers((prevItems) => prevItems.filter((item) => item.id !== profile.id));
	};

	const formContent = (
		<>
			<AlertDialog
				open={alertOpen}
				onOpenChange={(value) => {
					setAlertOpen(value);
				}}
			>
				<AlertDialogContent>
					<AlertDialogTitle>Warning!</AlertDialogTitle>
					<AlertDialogDescription>
						Changing the event date may invalidate users schedules
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setAlertOpen(false);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setAlertOpen(false);
								setHasBeenWarned(true);
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Form {...form}>
				<div className="flex h-full flex-col space-y-8">
					{currentStep === 0 && (
						<>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input type="text" placeholder="New event" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start</FormLabel>
										<div className="flex gap-2">
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-[240px] pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
															onClick={() => {
																if (!hasBeenWarned && isEditing) {
																	setAlertOpen(true);
																}
															}}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={(date) => {
															if (!date) return;

															const currentTime = form.getValues("startDate");
															date.setHours(currentTime.getHours());
															date.setMinutes(currentTime.getMinutes());
															if (date > form.getValues("endDate")) {
																form.setValue("endDate", addMinutes(date, 30));
															}
															field.onChange(date);
														}}
														disabled={(date: Date) => date < new Date()}
													/>
												</PopoverContent>
											</Popover>
											<Popover
												open={startClockOpen}
												modal={true}
												onOpenChange={(value) => {
													if (!hasBeenWarned && isEditing) {
														setAlertOpen(true);
													} else {
														setStartClockOpen(value);
													}
												}}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-[100px] pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
														>
															{field.value ? (
																format(field.value, "HH:mm")
															) : (
																<span>Pick a date</span>
															)}
															<Clock className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<TimeSelector
														value={field.value}
														onSelected={(hours, minutes) => {
															const newDate = new Date(
																field.value.getFullYear(),
																field.value.getMonth(),
																field.value.getDate(),
																hours,
																minutes,
															);
															form.setValue("startDate", newDate);
														}}
													/>
												</PopoverContent>
											</Popover>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End</FormLabel>
										<div className="flex gap-2">
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-[240px] pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
															onClick={() => {
																if (!hasBeenWarned && isEditing) {
																	setAlertOpen(true);
																}
															}}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={(date) => {
															if (!date) return;

															const currentTime = form.getValues("endDate");
															date.setHours(currentTime.getHours());
															date.setMinutes(currentTime.getMinutes());
															if (date < form.getValues("startDate")) {
																form.setValue("startDate", subMinutes(date, 30));
															}
															field.onChange(date);
														}}
														disabled={(date: Date) => date < new Date()}
													/>
												</PopoverContent>
											</Popover>
											<Popover
												open={endClockOpen}
												modal={true}
												onOpenChange={(value) => {
													if (!hasBeenWarned && isEditing) {
														setAlertOpen(true);
													} else {
														setEndClockOpen(value);
													}
												}}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-[100px] pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
														>
															{field.value ? (
																format(field.value, "HH:mm")
															) : (
																<span>Pick a date</span>
															)}
															<Clock className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<TimeSelector
														value={field.value}
														onSelected={(hours, minutes) => {
															const newDate = new Date(
																field.value.getFullYear(),
																field.value.getMonth(),
																field.value.getDate(),
																hours,
																minutes,
															);
															form.setValue("endDate", newDate);
														}}
													/>
												</PopoverContent>
											</Popover>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="pb-4">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea placeholder="Description" className="resize-none" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
					{currentStep === 1 && (
						<div className="flex h-full flex-col justify-start gap-2">
							<Tabs defaultValue="friends" className="w-full">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="friends">Friends</TabsTrigger>
									<TabsTrigger value="invited" className="gap-2">
										Invited <Badge className="bg-gray-300 px-1">{invitedUsers.length}</Badge>
									</TabsTrigger>
								</TabsList>
								<TabsContent value="friends">
									<div>
										{friendsList !== undefined && (
											<FriendSelector
												list={friendsList.filter(
													({ id }) => invitedUsers.findIndex((u) => u.id === id) === -1,
												)}
												icon={<Plus />}
												onClick={addSelectedUser}
											/>
										)}
									</div>
								</TabsContent>
								<TabsContent value="invited">
									<FriendSelector list={invitedUsers} icon={<Minus />} onClick={removeSelectedUser} />
								</TabsContent>
							</Tabs>
						</div>
					)}
					{currentStep === 2 && (
						<div className="m-auto flex w-full items-center justify-center gap-2">
							<LoaderCircle className="animate-spin" />
							Complete!
						</div>
					)}
				</div>
			</Form>
		</>
	);

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={(value) => {
					setOpen(value);
					if (value) {
						resetForm();
					}
				}}
			>
				<DialogTrigger asChild>{children}</DialogTrigger>

				<DialogContent
					onInteractOutside={(e) => {
						e.preventDefault();
					}}
					className="flex min-h-[500px] flex-col justify-between"
				>
					<div className="flex flex-col gap-2">
						<DialogHeader className="max-h-max">
							<DialogTitle>{isEditing ? "Edit event" : "Create new event"}</DialogTitle>
							<div className="flex gap-2">
								<div className={`h-1 w-full rounded-sm bg-blue-500`} />
								<div
									className={`h-1 ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`}
								/>
								<div
									className={`h-1 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`}
								/>
							</div>
							<DialogDescription>{steps[currentStep].name}</DialogDescription>
						</DialogHeader>
						{formContent}
					</div>
					<DialogFooter>
						<div className="flex w-full justify-between">
							<Button
								type="reset"
								variant={"ghost"}
								onClick={() => {
									form.reset();
									setCurrentStep(0);
								}}
								className="hover:bg-red-500 hover:text-white"
							>
								Reset
							</Button>
							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant={"ghost"}
									className={`${currentStep === 0 && "hidden"}`}
									onClick={() => {
										prev();
									}}
								>
									Back
								</Button>

								<Button
									type="button"
									onClick={() => {
										next();
									}}
								>
									Next
								</Button>
							</div>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer
			open={open}
			onOpenChange={(value: boolean) => {
				setOpen(value);
				if (value) {
					resetForm();
				}
			}}
			modal={true}
		>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="max-h-[96%] overflow-clip">
				<DrawerHeader>
					<DrawerTitle>{isEditing ? "Edit event" : "Create new event"}</DrawerTitle>
					<div className="flex gap-2">
						<div className={`h-1 w-full rounded-sm bg-blue-500`} />
						<div className={`h-1 ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`} />
						<div className={`h-1 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`} />
					</div>
				</DrawerHeader>
				<div className="overflow-y-auto overscroll-none px-4">{formContent}</div>
				<DrawerFooter>
					<div className="flex w-full">
						<Button
							type="button"
							variant={"ghost"}
							className={`${currentStep === 0 && "hidden"} w-full`}
							onClick={() => {
								prev();
							}}
						>
							Back
						</Button>

						<Button
							type="button"
							className="w-full"
							onClick={() => {
								next();
							}}
						>
							Next
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
