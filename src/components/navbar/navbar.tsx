"use client"
import styles from "./navbar.module.scss";
import { Button } from "../ui/button";
import Link from "next/link";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { useEffect, useMemo, useState } from "react";
import { useFriends, useNotifications, useProfile } from "@/swr/swrFunctions";
import { cx } from "class-variance-authority";
import ProfileDropdown from "./profile/profileDropdown";
import MobileNavbar from "./mobileNavbar";
import { useNotificationStore } from "@/store/Notifications";

export default function Navbar() {
  const { profile, isLoading: profileLoading } = useProfile()

  const [isMobile, setIsMobile] = useState(false);
  const { friends } = useFriends();
  const { notifications } = useNotifications();

  const setInitialState = useNotificationStore((state) => state.setInitialState);

  const signedIn = profile !== undefined;
  useEffect(() => {
    setInitialState(notifications?.filter(n => n.seen === false), friends?.filter(f => f.status === "pending" && f.incoming))

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleChange(e: MediaQueryListEvent | MediaQueryList) {
      setIsMobile(e.matches);
    }
    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [friends, notifications, setInitialState]);

  return (
    <header className={`${styles.wrapper} px-8 absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex gap-12 w-full items-center justify-between">
        <Link className="text-2xl font-bold h-fit" href={"/"}>
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
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
