"use server"
import styles from "./navbar.module.scss";
import { Button } from "../ui/button";
import Link from "next/link";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import ProfileDropdown from "./profile/profileDropdown";
import { getUserProfile } from "@/actions/profileActions";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { getFriends, FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery, getNotifications } from "@/actions/notificationAction";

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
    <div className={`${styles.wrapper} pl-16 pr-32 absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
        </div>
        {signedIn &&
          <div>
            <Link href="/events"><Button variant="ghost">
              <div className="font-medium text-xl">Events</div>
            </Button></Link>
          </div>
        }
      </div>

      <div className="flex gap-8 items-center">
        {signedIn ? <>
          <InboxPopover notifications={notifications} friends={friends} />
          <ProfileDropdown profile={profile!} friends={friends} />
        </>
          : <LoginDialog><Button>Login</Button></LoginDialog>}
      </div>
      {/* {!isMobile && (
          <SignedIn>
            <div className="font-medium text-xl">
              <div>
                <Link href="/events">Events</Link>
              </div>
            </div>
          </SignedIn>
        )}
      </div>
      {(!isMobile && (
        <div>
          <SignedIn>
            <div className="flex gap-4 items-center">
              <span className="font-medium text-base">{user?.firstName}</span>
              <div className=" w-8 h-8 justify-center items-center flex">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <div>
              <Button size={"sm"}>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      )) || (
          <Sheet>
            <SheetTrigger>
              <div className={`${styles.hamburgerMenu} w-8 h-8 flex justify-center items-center rounded-md`}>
                <TbMenu2 />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="pb-4">
                <SheetTitle>
                  {" "}
                  <span className="no-underline">Time</span>
                  <span className="underline">Lineup</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col w-full h-full">
                <SignedOut>
                  <div className="items-center text-center">
                    <SheetClose asChild className="bg-blue-500 p-2 rounded-md">
                      <Link href="/sign-in">Sign in</Link>
                    </SheetClose>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex gap-4 items-center pb-4">
                    <UserButton />
                    <span className="font-medium text-base">{user?.firstName}</span>
                  </div>
                  <div>
                    <SheetClose asChild>
                      <Link href="/user-profile" className="font-medium text-xl">
                        Manage account
                      </Link>
                    </SheetClose>
                  </div>
                  <div>
                    <SheetClose asChild>
                      <Link href="/events" className="font-medium text-xl">
                        Events
                      </Link>
                    </SheetClose>
                  </div>
                  <div className="h-fit absolute bottom-0 pb-8">
                    <SheetClose asChild>
                      <SignOutButton />
                    </SheetClose>
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        )} */}
    </div >
  );
}
