import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function CreateEventForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new event</DialogTitle>
          <DialogDescription>setup a new event</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
