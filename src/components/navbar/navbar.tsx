"use client"
import styles from "./navbar.module.scss";
import { Button } from "../ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import InboxPopover from "./inbox/inboxPopover";
import LoginDialog from "../login/loginDialog";
import { HeartHandshake, LogOut, MenuIcon, User } from "lucide-react";
import { Separator } from "../ui/separator";
import ProfileDialog from "./profile/profileDialog";
import { useState } from "react";
import { useProfile } from "@/swr/swrFunctions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import FriendsDialog from "./profile/friendsDialog";

export default function Navbar() {
  const { profile, isLoading: profileLoading, isError } = useProfile()
  const [dialogOption, setDialogOption] = useState<string>();
  const [sheetOpen, setSheetOpen] = useState(false);

  const signedIn = profile !== undefined;
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <header className={`${styles.wrapper} px-8 absolute z-50 h-24 w-full justify-between flex items-center`}>
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
              {signedIn && !profileLoading ? <>
                <InboxPopover />
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild >
                    <Avatar>
                      <AvatarImage src={profile.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-gray-200"><User /></AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-80">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => {
                      setDialogOption("profile")
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {
                      setDialogOption("friends")
                    }}>
                      <HeartHandshake className="mr-2 h-4 w-4" />
                      <span>Manage friends</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>

                  </DropdownMenuContent >
                </DropdownMenu>
              </>
                : <LoginDialog><Button>Login</Button></LoginDialog>}
            </div>
          </nav>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
              <Link className="font-medium hover:underline" href="#" onClick={() => {
                setDialogOption("profile")
                setSheetOpen(false);
              }}>
                Profile
              </Link>
              <Link className="font-medium hover:underline" href="#" onClick={() => {
                setSheetOpen(false);
                setDialogOption("friends")
              }}>
                Manage friends
              </Link>
            </div>
            <Link className="font-medium hover:underline px-6" href="#">
              Log out
            </Link>
          </SheetContent>
        </Sheet>
      </header >

      <ProfileDialog open={dialogOption === "profile"} onClose={() => {
        setDialogOption(undefined)
      }} />

      <FriendsDialog open={dialogOption === "friends"} onClose={() => {
        setDialogOption(undefined);
      }} />
    </>
  );
}
