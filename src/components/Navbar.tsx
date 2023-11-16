"use client";
import { ClerkLoaded, SignOutButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import styles from "@/styles/Components/Navbar.module.scss";
import { Button } from "./ui/button";
import Link from "next/link";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { TbMenu2 } from "react-icons/tb";
import Image from "next/image";
import DeviceDetector from "device-detector-js";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const deviceDetector = new DeviceDetector();
    const userAgent = window.navigator.userAgent;
    const device = deviceDetector.parse(userAgent);
    setIsMobile(device.device?.type === "smartphone");
  }, []);

  return (
    <div className={`${styles.wrapper} ${isMobile ? "pl-4 pr-4" : "pl-32 pr-32"} absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          <Link href="/">
            <span className="no-underline">Time</span>
            <span className="underline">Lineup</span>
          </Link>
        </div>
        {/* {!isMobile && (
          <ClerkLoaded>
            <SignedIn>
              <div className="font-medium text-xl">
                <div>
                  <Link href="/events">Events</Link>
                </div>
              </div>
            </SignedIn>
          </ClerkLoaded>
        )} */}
      </div>
      {/* {(!isMobile && (
        <div>
          <ClerkLoaded>
            <SignedIn>
              <div className="flex gap-4 items-center">
                <span className="font-medium text-l">{user?.firstName}</span>
                <div className=" w-8 h-8 justify-center items-center flex">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div>
                <Button size={"sm"}>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            </SignedOut>
          </ClerkLoaded>
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
                  <div className=" w-8 h-8 justify-center items-center flex">
                    {typeof user?.imageUrl === "string" && <Image src={user!.imageUrl as string} width={500} height={500} alt="User Avatar" className="rounded-full" />}
                  </div>
                  <span className="font-medium text-l">{user?.firstName}</span>
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
    </div>
  );
}
