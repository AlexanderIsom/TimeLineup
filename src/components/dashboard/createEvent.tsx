"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, max, roundToNearestMinutes } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import TimeSelectorPopover from "./timeSelector";
import { defineStepper } from "@stepperize/react"

const { useStepper } = defineStepper(
	{ id: "first", title: "Setup your event" },
	{ id: "last", title: "Add some friends" }
)

const formSchema = z.object({
	title: z.string().min(5, { message: "Event title must be at least 5 characters." }),
	description: z.string().optional(),
	date: z
		.date({
			required_error: "date is required",
		})
		.refine((value) => value >= new Date(), {
			message: "Cannot be in the past",
		}),
	startDateTime: z
		.date({
			required_error: "date is required",
		})
		.refine((value) => value >= new Date(), {
			message: "Cannot be in the past",
		}),
	endDateTime: z
		.date({
			required_error: "date is required",
		})
		.refine((value) => value >= new Date(), {
			message: "Cannot be in the past",
		}),
}).refine(
	(data) => {
		return data.endDateTime >= addMinutes(data.startDateTime, 15);
	},
	{ message: "Events cannot be less than 15 minutes long", path: ["endDate"] },
);

export default function CreateEvent() {
	const stepper = useStepper();

	const formDefaults = {
		title: "",
		description: "",
		date: new Date(),
		startDateTime: roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 15 }),
		endDateTime: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 15 }), 15),
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaults
	})
	const [minDate, setMinDate] = useState(formDefaults.startDateTime);
	const [modalString, setModalString] = useQueryState("dialog");
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		setIsOpen(modalString !== null && modalString === "new");
	}, [setIsOpen, modalString]);

	return <Dialog
		open={isOpen}
		onOpenChange={(open: boolean) => {
			if (!open) {
				setModalString(null);
			}
		}}
	>
		<DialogContent className="min-w-fit">
			<DialogHeader>
				{stepper.current.title}
			</DialogHeader>
			<Form {...form}>
				<form className="space-y-4">
					{stepper.when("first", (step) => (
						<>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Title" {...field} />
										</FormControl>
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
							<div className="flex gap-2">
								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem className="flex flex-col text-center">
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"justify-start text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={field.value}
														disabled={{ before: new Date() }}
														onSelect={(date) => {
															if (!date) return;
															form.setValue("date", date)
															setMinDate(max([date, formDefaults.startDateTime]))
														}}
														initialFocus
													/>
												</PopoverContent>
											</Popover>

											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="startDateTime"
									render={({ field }) => (
										<FormItem className="flex flex-col text-center">
											<TimeSelectorPopover
												start={minDate}
												value={field.value}
												onSelected={(date) => {
													form.setValue("startDateTime", date);
												}}
											>
												<FormControl>
													<Button
														variant={"outline"}
														className="w-28 flex gap-2"
													>
														{format(field.value, "K:mmaaa")}
													</Button>
												</FormControl>
											</TimeSelectorPopover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex flex-col justify-end p-2">
									-
								</div>
								<FormField
									control={form.control}
									name="endDateTime"
									render={({ field }) => (
										<FormItem className="flex flex-col text-center">

											<TimeSelectorPopover
												start={addMinutes(minDate, 15)}
												value={field.value}
												onSelected={(date) => {
													form.setValue("endDateTime", date);
												}}
											>
												<FormControl>
													<Button
														variant={"outline"}
														className="w-28 flex gap-2"
													>
														{format(field.value, "K:mmaaa")}
													</Button>
												</FormControl>
											</TimeSelectorPopover>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</>
					))}
					<div className="flex w-full justify-end gap-2">
						<Button type="button" variant="secondary" className={stepper.isFirst ? "hidden" : ""} onClick={stepper.prev}>Prev</Button>
						<Button type="button" onClick={stepper.isLast ? stepper.reset : stepper.next}>{stepper.isLast ? "Finish" : "Next"}</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	</Dialog>
}