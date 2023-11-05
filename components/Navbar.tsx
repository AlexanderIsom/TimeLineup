"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import styles from "@/style/Components/Navbar.module.scss";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { TbMenu2 } from "react-icons/tb";

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [navbarShown, setNavbarShown] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setNavbarShown(window.innerWidth > 900);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarShown]);

  return (
    <div
      className={`${styles.wrapper} ${
        navbarShown ? "pl-32 pr-32" : "pl-4 pr-4"
      } absolute z-50 h-24 w-full justify-between flex items-center`}
    >
      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          <Link href="/">
            <span className="no-underline">Time</span>
            <span className="underline">Lineup</span>
          </Link>
        </div>
        {navbarShown && (
          <div className="font-medium text-xl">
            {isSignedIn && (
              <div>
                <Link href="/events">Events</Link>
              </div>
            )}
          </div>
        )}
      </div>
      {(navbarShown && (
        <div>
          {isLoaded &&
            ((isSignedIn && (
              <div className="flex gap-4 items-center">
                <span className="font-medium text-l">{user?.firstName}</span>
                <div className=" w-8 h-8 justify-center items-center flex">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            )) || (
              <div>
                <Button size={"sm"}>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            ))}
        </div>
      )) || (
        <Sheet>
          <SheetTrigger>
            <TbMenu2 />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigate</SheetTitle>
            </SheetHeader>
            <div className={`${!isSignedIn && "justify-center text-center"}`}>
              {isLoaded &&
                ((isSignedIn && (
                  <div className="flex gap-4 items-center">
                    <span className="font-medium text-l">
                      {user?.firstName}
                    </span>
                    <div className=" w-8 h-8 justify-center items-center flex">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                )) || (
                  <Button size={"sm"}>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                ))}
            </div>
            {isSignedIn && (
              <SheetClose asChild>
                <Link href="/events" className="font-medium text-xl">
                  Events
                </Link>
              </SheetClose>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
