"use server"
import styles from "./navbar.module.scss";
import { Button } from "../ui/button";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ProfileDropdown from "./profile/profileDropdown";
import { getUserProfile } from "@/actions/profileActions";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { getFriends, FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery, getNotifications } from "@/actions/notificationAction";
import { MenuIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import ProfileDialog from "./profile/profileDialog";

export default async function Navbar() {
  let profile = await getUserProfile();
  let friends: FriendStatusAndProfile
  let notifications: NotificationQuery

  const signedIn = profile !== undefined;

  if (profile !== undefined) {
    friends = await getFriends();
    notifications = await getNotifications();
  }

  return (
    <header className={`${styles.wrapper} px-8 md:px-16 absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex gap-12 w-full">
        <div className="text-2xl font-bold">
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
        </div>

        <nav className="hidden w-full md:flex justify-between">
          {signedIn &&
            <div>
              <Link href="/events"><Button variant="ghost">
                <div className="font-medium text-xl">Events</div>
              </Button></Link>
            </div>
          }
          <div className="flex gap-8 items-center">
            {signedIn ? <>
              <InboxPopover notifications={notifications} friends={friends} />
              <ProfileDropdown profile={profile!} friends={friends} />
            </>
              : <LoginDialog><Button>Login</Button></LoginDialog>}
          </div>
        </nav>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"right"} className="flex flex-col justify-between">
          <div className="grid gap-6 p-6">
            <Link href="/events" className="font-medium hover:underline">
              Events
            </Link>
            <Separator />
            <Link className="font-medium hover:underline" href="#">
              Profile
            </Link>
            <Link className="font-medium hover:underline" href="#">
              Manage friends
            </Link>
          </div>
          <Link className="font-medium hover:underline px-6" href="#">
            Log out
          </Link>
        </SheetContent>
      </Sheet>
    </header >
  );
}
