"use client";

import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import "./styles.scss";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TbClick,
  TbCode,
  TbUserCheck,
  TbPuzzle,
  TbBrush,
  TbContrast2,
  TbClockSearch,
  TbShieldCheckFilled,
  TbBellRinging,
} from "react-icons/tb";
import Image from "next/image";
import BoxItem from "@/components/BoxItem";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimatedTimeCard from "@/components/landingPage/animatedTimeCard";
import { useEffect, useRef, useState } from "react";
import DateCard from "@/components/landingPage/dateCard";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isAnimatiedDivShown, setAnimatedDivShown] = useState(true);
  const animatedDivContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (animatedDivContainer.current) {
        const style = window.getComputedStyle(animatedDivContainer.current);
        setAnimatedDivShown(style.display !== "none");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [animatedDivContainer]);

  return (
    <main className={"main"}>
      <div className={"backgroundFade"}>
        <div className={`${"titleContainer"} overflow-hidden`}>
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
              <div className="flex w-full gap-4 buttonsContainer">
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
          <div className="titleImage" ref={animatedDivContainer}>
            {isAnimatiedDivShown && (
              <div className="titleBoxThing flex flex-col">
                <div>
                  <AnimatedTimeCard
                    initialX={20}
                    animateX={[20, 200]}
                    width={300}
                    duration={1}
                    repeatDelay={2}
                  />
                </div>

                <div>
                  <AnimatedTimeCard
                    initialX={40}
                    animateX={[40, 200, 200, 200, 100]}
                    animateWidth={[200, 400, 400, 300, 300]}
                    width={200}
                    duration={2.5}
                    repeatDelay={2}
                  />
                </div>

                <div>
                  <AnimatedTimeCard
                    initialX={400}
                    animateX={[400, 700, 280, 160, 20]}
                    animateWidth={[380, 220, 220, 360, 360]}
                    width={400}
                    delay={1.5}
                    duration={4}
                    repeatDelay={2}
                  />
                </div>

                <div>
                  <AnimatedTimeCard
                    initialX={500}
                    animateX={[500, 500, 200, -100, 180, 500]}
                    width={800}
                    duration={3}
                    repeatDelay={2}
                  />
                </div>

                <div>
                  <AnimatedTimeCard
                    initialX={400}
                    animateX={[400, 200, 400, 100, 100, 100]}
                    animateWidth={[100, 100, 150, 100]}
                    width={100}
                    duration={5}
                    repeatDelay={1}
                  />
                </div>
              </div>
            )}
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
        <div className="flex descirptionsIconsGrid">
          <div className="pl-4 pt-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbClick size={30} />
              </div>
              <h6 className="font-regular text-xl">Built for friends!</h6>
              <p className="iconSubText">
                TimeLineup was born from frustation.
                <br /> online events in varying timezones shouldnt be hard
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbCode size={30} />
              </div>
              <h6 className="font-regular text-xl">Designed to be easy</h6>
              <p className="iconSubText">
                Based on simple yet powerful features
                <br /> to make event organising blissful
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className="flex rounded-full svgIconContainer ">
                <TbUserCheck size={30} />
              </div>
              <h6 className="font-regular text-xl">Continuously developing</h6>
              <p className="iconSubText">
                Feeback from our users is key and we constantly improve to make
                things effortless for you
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lower">
        <div className="margin middle">
          <div className="text-center m-auto">
            <h4>Plan and create events fast</h4>
            <p className="pSubText">
              Events are easy to create, intuitive and simple
              <br />
              with real time notifications so you dont miss a thing
              <br />
              in any timezone
            </p>
            <div className="flex bg-gray-100 h-64 rounded-lg overflow-hidden justify-center items-center relative">
              <Image
                src={"/landing/Chat.png"}
                alt="Chat"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
        <div className="margin">
          <div>
            <div className="flex">
              <div className="pl-8 pt-8 imageDescription">
                <h4>Powerful and flexible events for all kinds of functions</h4>
                <p className="pSubText">
                  Whether you&apos;re planning to skype, have a simple call, a
                  game of among us, or a in person party, TimeLineup helps you
                  create the best possible events for your friends.
                </p>
                <div className="statContainer">
                  <div className="statItem">
                    <span className="statHeader">
                      <AnimatedNumber from={0} to={100} duration={3} />
                    </span>
                    <p>Create up to 100 events per user.</p>
                  </div>
                  <div className="statItem">
                    <span className="statHeader">
                      <AnimatedNumber from={0} to={30} duration={3} />
                    </span>
                    <p>
                      30 day retention, old expired events are deleted after 30
                      days.
                    </p>
                  </div>
                  <div className="statItem">
                    <span className="statHeader">
                      <AnimatedNumber from={0} to={24} duration={3} />
                    </span>
                    <p>24 timezones all synced perfectly to events.</p>
                  </div>
                </div>
              </div>
              <div className="pl-8 pt-8 flexItem w-full image">
                <div className="w-full h-full imageShadow rounded-lg">
                  <div className=" h-full w-full flex gap-4 pl-4 pt-4">
                    <DateCard heading="Event 1" />
                    <DateCard heading="Event 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="margin">
          <div className="boxContainer">
            <BoxItem index={0}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbPuzzle size={25} color="white" />
                </div>
                <h6 className="mb-2">Simple</h6>
                <p className="boxDescription">
                  Designed with simplicity in mind. Create new events in
                  moments.
                </p>
              </div>
            </BoxItem>
            <BoxItem index={1}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbContrast2 size={25} color="white" />
                </div>
                <h6 className="mb-2">Flexible</h6>
                <p className="boxDescription">
                  Easily re-organise and re-schedule events and attending times
                  with the click of a mouse
                </p>
              </div>
            </BoxItem>
            <BoxItem index={2}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbBrush size={25} color="white" />
                </div>
                <h6 className="mb-2">Customizable</h6>
                <p className="boxDescription">
                  Events have huge number of options to adjust from date time,
                  agenda and invites.
                </p>
              </div>
            </BoxItem>
            <BoxItem index={3}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbClockSearch size={25} color="white" />
                </div>
                <h6 className="mb-2">Timezones</h6>
                <p className="boxDescription">
                  Event times automatically adjust to the timezone you&apos;re
                  in, making time planning easy for you.
                </p>
              </div>
            </BoxItem>
            <BoxItem index={4}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbShieldCheckFilled size={25} color="white" />
                </div>
                <h6 className="mb-2">Safe</h6>
                <p className="boxDescription">
                  Old events are deleted and no data is saved long term, data
                  transparency for us is key.
                </p>
              </div>
            </BoxItem>
            <BoxItem index={5}>
              <div className="rounded-lg  h-full w-full p-8 boxInnerItem">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TbBellRinging size={25} color="white" />
                </div>
                <h6 className="mb-2">Real time</h6>
                <p className="boxDescription">
                  Whether&apos;s its an event update or users respond to your
                  own event, you&apos;ll get notifications in real time.
                </p>
              </div>
            </BoxItem>
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
      <div className="text-center margin">
        <div>
          <h4>Get started with TimeLineup today</h4>
          <p className="pSubText mb-8">
            Build simple, easy, flexible and fully customizable events.
          </p>
          <div className="flex w-full gap-4 justify-center">
            <Button size={"lg"} className="footerButton">
              <Link href="/sign-in">Get started</Link>
            </Button>
            <Button variant={"outline"} size={"lg"} className="footerButton">
              <Link href="/sign-in">Find out more</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
