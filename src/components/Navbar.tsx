import styles from "@/styles/Components/Navbar.module.scss";
import { Button } from "./ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import ProfileButton from "./ProfileButton/ProfileButton";
import { getUserProfile } from "@/app/profile/actions";
import { Profile } from "@/db/schema";
// import { useEffect, useState } from "react";

export default async function Navbar() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user
  const signedIn = user !== null;
  let profile: Profile | undefined;
  if (signedIn) {
    profile = await getUserProfile();
  }

  return (
    <div className={`${styles.wrapper} pl-16 pr-32 absolute z-50 h-24 w-full justify-between flex items-center`}>
      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          <span className="no-underline">Time</span>
          <span className="underline">Lineup.</span>
        </div>
        {signedIn &&
          <div className="font-medium text-xl">
            <div>
              <Link href="/events">Events</Link>
            </div>
          </div>
        }
      </div>
      {signedIn && <ProfileButton profile={profile!} />}
      {!signedIn && <Link href="/login"><Button>Login</Button></Link>}
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
