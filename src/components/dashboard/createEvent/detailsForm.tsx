import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { DetailFormValues } from ".";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addMinutes, endOfDay, format, isSameDay, roundToNearestMinutes } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import TimeSelectorPopover from "../timeSelector";

function setHoursFromDate(date: Date) {
	const newDate = new Date(0);
	newDate.setHours(date.getHours(), date.getMinutes())
	return newDate;
}

export default function DetailsForm() {
	const form = useFormContext<DetailFormValues>();
	const roundedCurrentDate = roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 15 })
	const timeStart = setHoursFromDate(roundedCurrentDate);
	const [minStartTime, setMinStartTime] = useState(setHoursFromDate(roundedCurrentDate))
	const [startTime, setStartTime] = useState(minStartTime);

	return (
		<>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
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
					<FormItem>

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
						<FormItem className="flex flex-col text-center w-full">
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
											setMinStartTime(setHoursFromDate(date))
											if (isSameDay(new Date(), date)) {
												let startTime = form.getValues("startDateTime");
												if (startTime < new Date()) {
													const newStartTime = roundToNearestMinutes(addMinutes(new Date(), 15), { roundingMethod: "ceil", nearestTo: 15 });
													form.setValue("startDateTime", newStartTime);
													startTime = newStartTime;
												}
												const endTime = form.getValues("endDateTime");
												if (endTime < startTime) {
													const newEndTime = roundToNearestMinutes(addMinutes(startTime, 15), { roundingMethod: "ceil", nearestTo: 15 });
													form.setValue("endDateTime", newEndTime);
												}
											}
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
								start={minStartTime}
								end={endOfDay(minStartTime)}
								selected={field.value}
								onSelected={(date) => {
									form.setValue("startDateTime", date);
									setStartTime(date)
									if (date >= form.getValues("endDateTime")) {
										form.setValue("endDateTime", addMinutes(date, 15))
									}
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
								start={addMinutes(startTime, 15)}
								end={endOfDay(startTime)}
								selected={field.value}
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
	)
}