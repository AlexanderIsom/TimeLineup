import { Button } from "../ui/button";
import Link from "next/link";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
// import { useEffect } from "react";
// import { useFriends, useNotifications } from "@/swr/swrFunctions";
// import { cx } from "class-variance-authority";
import ProfileDropdown from "./profile/profileDropdown";
// import { useNotificationStore } from "@/store/Notifications";
// import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getUserProfile } from "@/actions/profileActions";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Calendar, HeartHandshake, InboxIcon, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import InboxDialog from "./inbox/inboxDialog";
import FriendsDialog from "./profile/friendsDialog";
import ProfileDialog from "./profile/profileDialog";

export default async function Navbar() {
  const [profile] = await Promise.all([getUserProfile()])
  // const { profile, isLoading: profileLoading } = useProfile()

  // const isDesktop = useMediaQuery('(min-width: 768px)');
  // const { friends } = useFriends();
  // const { notifications } = useNotifications();

  // const setInitialState = useNotificationStore((state) => state.setInitialState);

  // useEffect(() => {
  //   setInitialState(notifications?.filter(n => n.seen === false), friends?.filter(f => f.status === "pending" && f.incoming))
  // }, [friends, notifications, setInitialState]);

  return (
    <header className="backdrop-blur-md border-b border-gray-200 bg-white/90 shadow-md shadow-gray-100 px-8 fixed z-50 h-24 w-full justify-between flex items-center">
      <div className="flex gap-12 w-full items-center justify-between">
        <Link className="text-2xl font-bold h-fit" href={"/"}>
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
        </Link>

        <nav className={`w-full ${profile ? 'justify-between' : 'justify-end'} hidden md:flex`}>
          {profile ?
            <>
              <Link href="/events"><Button variant="ghost">
                <div className="font-medium text-xl">Events</div>
              </Button></Link>

              <div className="flex gap-8 items-center">
                <InboxPopover />
                <ProfileDropdown />
              </div>
            </>
            :
            <LoginDialog>
              <Button> Login</Button>
            </LoginDialog>
          }
        </nav>

        <Sheet>
          <SheetTrigger asChild className="block md:hidden">
            <Button size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"} className="flex flex-col">
            {/*{profile === undefined ?
              <div className="flex flex-col h-full justify-end items-center">
                <div className="flex flex-col w-full gap-6 p-6  items-center">
                  Please login to continue
                  <Separator />
                  <LoginDialog>
                    <div className="font-medium hover:underline flex items-center" >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span> Login</span>
                    </div>
                  </LoginDialog>
                </div>
              </div> :
              <div className="flex flex-col h-full justify-between">
                <div className="grid gap-6 px-2 py-6 ">
                  <InboxDialog>
                    <div className="font-medium hover:underline hover:cursor-pointer flex items-center">
                      <InboxIcon className="mr-2 h-4 w-4" />
                      <span>Inbox</span>
                      /~ <Badge className="mx-2">3</Badge>  ~/
                    </div>
                  </InboxDialog>

                  <Link href="/events" className="font-medium hover:underline hover:cursor-pointer flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Events</span>
                  </Link>

                  <ProfileDialog>
                    <div className="font-medium hover:underline hover:cursor-pointer flex items-center" >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </ProfileDialog>
                  <FriendsDialog>
                    <div className="font-medium hover:underline hover:cursor-pointer flex items-center" >
                      <HeartHandshake className="mr-2 h-4 w-4" />
                      <span>Manage friends</span>
                    </div>
                  </FriendsDialog>
                </div>
                <div className="font-medium hover:underline px-2 flex hover:cursor-pointer items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </div>
              </div>
            }*/}
          </SheetContent>
        </Sheet >
      </div>
    </header >

  );
}
