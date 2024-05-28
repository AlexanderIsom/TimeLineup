"use client"
import { Button } from "../ui/button";
import Link from "next/link";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { useEffect } from "react";
import { useFriends, useNotifications, useProfile } from "@/swr/swrFunctions";
import { cx } from "class-variance-authority";
import ProfileDropdown from "./profile/profileDropdown";
import MobileNavbar from "./mobileNavbar";
import { useNotificationStore } from "@/store/Notifications";
import { useIsMobile } from "@/utils/useIsMobile";

export default function Navbar() {
  const { profile, isLoading: profileLoading } = useProfile()

  const isMobile = useIsMobile();
  const { friends } = useFriends();
  const { notifications } = useNotifications();

  const setInitialState = useNotificationStore((state) => state.setInitialState);

  const signedIn = profile !== undefined;
  useEffect(() => {
    setInitialState(notifications?.filter(n => n.seen === false), friends?.filter(f => f.status === "pending" && f.incoming))
  }, [friends, notifications, setInitialState]);

  return (
    <header className="backdrop-blur-md border-b border-gray-200 bg-white/90 shadow-md shadow-gray-100 px-8 fixed z-50 h-24 w-full justify-between flex items-center">
      <div className="flex gap-12 w-full items-center justify-between">
        <Link className="text-2xl font-bold h-fit" href={"/"}>
          <span>some website</span>
          {/* <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span> */}
        </Link>

        {!isMobile &&
          <nav className={cx('w-full flex', signedIn ? "justify-between" : "justify-end")}>
            {(!signedIn && !profileLoading) && <LoginDialog>
              <Button> Login</Button></LoginDialog>}

            {(signedIn && profile) &&
              <>
                <Link href="/events"><Button variant="ghost">
                  <div className="font-medium text-xl">Events</div>
                </Button></Link>

                <div className="flex gap-8 items-center">
                  <InboxPopover />
                  <ProfileDropdown />
                </div>
              </>
            }
          </nav>
        }

        {isMobile && <MobileNavbar signedIn={signedIn} profileLoading={profileLoading} />}
      </div>
    </header >

  );
}
