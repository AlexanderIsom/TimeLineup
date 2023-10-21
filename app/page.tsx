"use client";

import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import "./styles.scss";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TbClick, TbCode, TbUserCheck } from "react-icons/tb";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <main className={"main"}>
      <div className={"backgroundFade"}>
        <div className={`${"titleContainer"}`}>
          <div className={`margin`}>
            <div className={`${"titles"}`}>
              <h2>
                Make your events
                <br />
                actually <span className={"successText"}>happen.</span>
              </h2>
              <p className={"titleDescription"}>
                Timelineup allows you to plan out events for anyone anywhere in
                any timezone.
              </p>
              <div className="flex gap-4">
                <Button size={"lg"}>
                  <Link href="/sign-in">Get started</Link>
                </Button>
                <Button variant={"outline"} size={"lg"}>
                  <Link href="/sign-in">Find out more</Link>
                </Button>
              </div>
              {isLoaded && isSignedIn && (
                <div>
                  Hello, {user?.firstName}
                  <div className=" w-8 h-8 justify-center items-center flex">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <svg
          className={"svgBlocker"}
          preserveAspectRatio="none"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
        >
          <path
            fill="#ffffff"
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </svg>
      </div>
      <div className="margin">
        <div className="text-center pb-4 ">
          <h4>Create worldwide events quickly and easily</h4>
          <p className="pSubText">
            Simple, flexable and easy to make events for friends for all around
            the world.
          </p>
        </div>
        <div className="flex flex-row">
          <div className="pl-4 pt-4 w-full">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbClick size={30} />
              </div>
              <p className="font-semibold text-xl">Built for friends!</p>
              <p className="iconSubText">
                TimeLineup was born from frustation.
                <br /> online events in varying timezones shouldnt be hard
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbCode size={30} />
              </div>
              <p className="font-semibold text-xl">Designed to be easy</p>
              <p className="iconSubText">
                Based on simple yet powerful features
                <br /> to make event organising blissful
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbUserCheck size={30} />
              </div>
              <p className="font-semibold text-xl">Continuously developing</p>
              <p className="iconSubText">
                Feeback from our users is key and we constantly improve to make
                things effortless for you
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="margin middle">
          <div className="text-center m-auto">
            <h4>Build tools and full documentation </h4>
            <p className="pSubText">
              Components, plugins, and build tools are all thoroughly <br />
              documented with live examples and markup for easier use <br />
              and customization
            </p>
            <div className="bg-blue-600 h-64 rounded-lg"></div>
          </div>
        </div>
        <div className="margin">
          <div>
            <div className="flex">
              <div className="pl-8 pt-8 flexItem">
                <h4>
                  The powerful and flexible theme for all kinds of businesses
                </h4>
                <p className="pSubText">
                  Whether youre creating a subscription service, an on-demand
                  marketplace, an e-commerce store, or a portfolio showcase,
                  theFront helps you create the best possible product for your
                  users.
                </p>
                <div className="flex w-full">
                  <div className="w-full">
                    <p>300+</p>
                  </div>
                  <div className="w-full">
                    <p>45+</p>
                  </div>
                  <div className="w-full">
                    <p>99%</p>
                  </div>
                </div>
              </div>
              <div className="pl-8 pt-8 flexItem w-full">
                <div className="bg-blue-600 h-64 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
