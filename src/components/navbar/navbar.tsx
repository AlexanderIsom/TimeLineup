"use client"
import styles from "./navbar.module.scss";
import { Button } from "../ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { Calendar, HeartHandshake, LogIn, LogOut, MenuIcon, User } from "lucide-react";
import { Separator } from "../ui/separator";
import ProfileDialog from "./profile/profileDialog";
import { use, useEffect, useState } from "react";
import { useProfile } from "@/swr/swrFunctions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import FriendsDialog from "./profile/friendsDialog";
import { cx } from "class-variance-authority";
import ProfileDropdown from "./profile/profileDropdown";
import MobileNavbar from "./mobileNavbar";

export default function Navbar() {
  const { profile, isLoading: profileLoading, isError } = useProfile()
  const [isMobile, setIsMobile] = useState(false);

  const signedIn = profile !== undefined;
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    mediaQuery.addEventListener('change', handleChange);
    setIsMobile(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <header className={`${styles.wrapper} px-8 absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex gap-12 w-full items-center justify-between">
        <div className="text-2xl font-bold h-fit">
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
        </div>

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

        {isMobile && <MobileNavbar signedIn profileLoading />}
      </div>
    </header >

  );
}
