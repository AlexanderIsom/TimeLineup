import { DetailFormValues } from "@/components/dashboard/createEvent";
import { create } from "zustand";

interface NewEventStore {
	details: DetailFormValues;
	invitees: string[];
	setDetails: (details: DetailFormValues) => void;
	setInvitees: (invitees: string[]) => void;
}

export const useEventStore = create<NewEventStore>((set) => ({
	details: {} as DetailFormValues,
	invitees: [],
	setDetails: (details: DetailFormValues) => {
		set({ details });
	},
	setInvitees: (invitees: string[]) => {
		set({ invitees: invitees });
	},
}));
