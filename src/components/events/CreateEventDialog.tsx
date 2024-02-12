"use client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { NewEventForm } from "./CreateEventForm";

export default function CreateEventDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button >+</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create new event</DialogTitle>
        </DialogHeader>
        <NewEventForm />
      </DialogContent>
    </Dialog>
  );
}
