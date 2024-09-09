"use client"

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { addMinutes, roundToNearestMinutes, startOfDay } from "date-fns";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";
import DetailsForm from "./detailsForm";
import FriendsForm from "./friendsForm";

const detailsSchema = z.object({
	title: z.string().min(5, { message: "Event title must be at least 5 characters." }),
	description: z.string().optional(),
	date: z
		.date({
			required_error: "date is required",
		})
		.refine((value) => value >= startOfDay(new Date()), {
			message: "Cannot be in the past",
		}),
	startDateTime: z
		.date({
			required_error: "date is required",
		}),
	endDateTime: z
		.date({
			required_error: "date is required",
		})
}).refine(
	(data) => {
		return data.endDateTime >= addMinutes(data.startDateTime, 15);
	},
	{ message: "Events cannot be less than 15 minutes long", path: ["endDate"] },
);

const friendsSchema = z.object({
	invitees: z.string().array()
})

export type DetailFormValues = z.infer<typeof detailsSchema>

const { useStepper } = defineStepper(
	{ id: "addDetails", title: "Setup your event", schema: detailsSchema },
	{ id: "addFriends", title: "Add some friends", schema: friendsSchema }
)

function setHoursFromDate(date: Date) {
	const newDate = new Date(0);
	newDate.setHours(date.getHours(), date.getMinutes())
	return newDate;
}

export default function CreateEvent() {
	const roundedCurrentDate = roundToNearestMinutes(new Date(), { roundingMethod: "ceil", nearestTo: 15 })
	const timeStart = setHoursFromDate(roundedCurrentDate);
	const stepper = useStepper();

	const formDefaults = {
		title: "",
		description: "",
		date: startOfDay(new Date()),
		startDateTime: timeStart,
		endDateTime: addMinutes(timeStart, 15),
	}

	const form = useForm({
		mode: "onTouched",
		resolver: zodResolver(stepper.current.schema),
		defaultValues: formDefaults
	})
	const [modalString, setModalString] = useQueryState("dialog");
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
		// store values on submit
		if (stepper.isLast) {
			stepper.reset();
		} else {
			stepper.next();
		}
	}

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
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{stepper.switch({
						addDetails: () => <DetailsForm />,
						addFriends: () => <FriendsForm />,
					})}

					<div className="flex w-full justify-between gap-2">
						<Button type="button" variant={"destructive"} onClick={() => {
							form.reset();
						}}>Reset</Button>
						<div className="flex gap-2">
							<Button type="button" variant="secondary" className={stepper.isFirst ? "hidden" : ""} onClick={stepper.prev}>Back</Button>
							<Button type="submit">Next</Button>
						</div>
					</div>
				</form>
			</Form>
		</DialogContent>
	</Dialog>
}