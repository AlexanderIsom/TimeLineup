'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEvent } from "@/actions/eventActions"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import { CalendarIcon, Clock, LoaderCircle, Minus, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"
import TimeSelector from "@/components/timeSelector/timeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendSelector from "./friendSelector";
import { useGetFriends } from "@/actions/hooks";
import { InsertEvent, Profile } from "@/db/schema";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters",
  }),
  startDate: z.date({
    required_error: "date is required",
  }).refine((value) => {
    return value >= new Date();
  }, { message: "Cannot be in the past" }),
  endDate: z.date({
    required_error: "date is required",
  }).refine((value) => {
    return value >= new Date();
  }, { message: "Cannot be in the past" }),
  description: z.string().optional(),
}).refine(data => {
  return data.endDate >= addMinutes(data.startDate, 30)
}, { message: "Events must be at least 30 minutes long", path: ["endDate"] });

const steps = [
  {
    id: 'Step 1',
    name: 'Event details',
    fields: ['title', 'startDate', 'endDate', 'description']
  },
  {
    id: 'Step 2',
    name: 'Invite friends',
    fields: ['invitedFriends']
  },
  {
    id: 'Step 3',
    name: 'Complete',
  }
]

export default function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState<Array<Profile>>([]);
  const { data: friendships, isError, isLoading, error } = useGetFriends();

  const friends = friendships?.filter(u => u.status === "accepted").map(u => u.profile);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startDate: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: 'ceil', nearestTo: 5 }), 60),
      endDate: addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: 'ceil', nearestTo: 5 }), 95),
    },
  });

  function processForm(values: z.infer<typeof formSchema>) {
    const data: InsertEvent = { title: values.title, start: values.startDate, end: values.endDate, description: values.description } as InsertEvent;
    createEvent(data, invitedUsers).then((newEventId) => {
      setOpen(false);
      toast.message("Event has been created", {
        description: format(data.start, "iiii, MMMM dd, yyyy 'at' h:mm aa"),
        action: {
          label: "Goto",
          onClick: () => {
            router.push(`/events/${newEventId}`)
          },
        },
      })
      router.refresh();
    });
  }

  type FieldName = keyof z.infer<typeof formSchema>;

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await form.trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)()
      }
      setCurrentStep(step => step + 1);
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1)
    }
  }

  const addSelectedUser = (profile: Profile) => {
    setInvitedUsers(prevItems => [...prevItems, profile])
  }

  const removeSelectedUser = (profile: Profile) => {
    setInvitedUsers(prevItems => prevItems.filter(item => item.id !== profile.id));
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (value) {
        form.reset();
        setCurrentStep(0);
        setInvitedUsers([]);
        form.setValue("startDate", roundToNearestMinutes(new Date(), { roundingMethod: 'ceil', nearestTo: 5 }))
        form.setValue("endDate", addMinutes(roundToNearestMinutes(new Date(), { roundingMethod: 'ceil', nearestTo: 5 }), 30))
      }
    }}>
      <DialogTrigger asChild>
        <Button size={"lg"}>New event</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="min-h-[500px] flex flex-col justify-between"
      >
        <div className="flex flex-col gap-2">
          <DialogHeader className="max-h-max">
            <DialogTitle>Create new event</DialogTitle>
            <div className="flex gap-2">
              <div className={`h-1 bg-blue-500 w-full rounded-sm`} />
              <div className={`h-1 ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`} />
              <div className={`h-1 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"} w-full rounded-sm`} />
            </div>
            <DialogDescription>{steps[currentStep].name}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <div className="space-y-8 flex flex-col h-full">
              {currentStep === 0 && <>
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
                              <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date()} />
                          </PopoverContent>
                        </Popover>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-[100px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "HH:mm") : <span>Pick a date</span>}
                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" >
                            <TimeSelector value={field.value} onSelected={(hours, minutes) => {
                              const newDate = new Date(
                                field.value.getFullYear(),
                                field.value.getMonth(),
                                field.value.getDate(),
                                hours,
                                minutes
                              );
                              form.setValue("startDate", newDate)
                            }} />
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
                              <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date()} />
                          </PopoverContent>
                        </Popover>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-[100px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "HH:mm") : <span>Pick a date</span>}
                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" >
                            <TimeSelector value={field.value} onSelected={(hours, minutes) => {
                              const newDate = new Date(
                                field.value.getFullYear(),
                                field.value.getMonth(),
                                field.value.getDate(),
                                hours,
                                minutes
                              );
                              form.setValue("endDate", newDate)
                            }} />
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
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl >
                        <Textarea placeholder="Description" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>}
              {currentStep === 1 && <div className="flex flex-col justify-start h-full gap-2">
                <Tabs defaultValue="friends" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="invited" className="gap-2">Invited <Badge className="px-1 bg-gray-300 ">{invitedUsers.length}</Badge></TabsTrigger>
                  </TabsList>
                  <TabsContent value="friends">
                    {isLoading ? <div>Loading...</div> :
                      <div>
                        <FriendSelector list={friends!.filter(u => !invitedUsers.includes(u))} icon={<Plus />} onClick={addSelectedUser} />
                      </div>
                    }
                  </TabsContent>
                  <TabsContent value="invited">
                    <FriendSelector list={invitedUsers} icon={<Minus />} onClick={removeSelectedUser} />
                  </TabsContent>
                </Tabs>
              </div>}
              {currentStep === 2 &&
                <div className="flex w-full justify-center gap-2 m-auto items-center">
                  <LoaderCircle className="animate-spin" />
                  Complete!
                </div>
              }
            </div>
          </Form>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button type="reset" variant={"ghost"} onClick={() => {
            form.reset();
            setCurrentStep(0);
          }} className="hover:bg-red-500 hover:text-white">Reset</Button>
          <div className="flex justify-end gap-2">
            <Button type="button" variant={"ghost"} onClick={() => {
              prev()
            }}>Back</Button>

            <Button type="button" onClick={() => {
              next()
            }}>Next</Button>
          </div>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  );
}
