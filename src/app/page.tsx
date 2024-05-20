"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, BellRing, Brush, CodeXml, DraftingCompass, Earth, MousePointerClick, Puzzle, UserCheck } from "lucide-react"

import BoxItem from "@/components/landingPage/BoxItem";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimatedTimeCard from "@/components/landingPage/animatedTimeCard";
import LoginDialog from "@/components/login/loginDialog";
import Image from "next/image";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return (
    <div className="md:pt-16">
      <div className="bg-gradient-to-b from-white/0 to-blue-50">
        <div className="flex max-w-6xl mx-auto">
          <div className="mx-auto grow-0 z-20 py-8 md:py-16 px-4 md:px-16 ">
            <span className="font-bold text-5xl md:text-7xl">
              Make your events
              <br />
              actually <span className="text-primary bg-gradient-to-b from-transparent from-[82%] via-orange-300 via-[82%] to-orange-300">happen.</span>
            </span>
            <p className="py-8 font-normal leading-6 text-xl md:text-2xl w-full">Timelineup allows you to plan out events for anyone anywhere in any timezone.</p>
            <div className="flex w-full gap-4 flex-col md:flex-row">
              <LoginDialog><Button size={"lg"}>Get started</Button></LoginDialog>
            </div>
          </div>
          {isDesktop && (
            <div className="w-1/4 h-auto z-10 rotate-[-15deg] -translate-x-56 ">
              <div className="flexm flex-col w-[500px] h-full bg-[linear-gradient(to_right,#c6c6c6_1px,transparent_1px),linear-gradient(to_bottom,#c6c6c6_1px,transparent_1px)] bg-[size:60px_100px]">
                <AnimatedTimeCard initialX={20} animateX={[20, 200]} width={300} duration={1} repeatDelay={2} />
                <AnimatedTimeCard initialX={100} animateX={[200, 500, 280, 160, -50]} animateWidth={[380, 220, 220, 360, 360]} width={400} delay={1.5} duration={4} repeatDelay={2} />
                <AnimatedTimeCard initialX={50} animateX={[100, 100, 30, -50, 180, 120]} width={300} duration={3} repeatDelay={2} />
                <AnimatedTimeCard initialX={400} animateX={[400, 200, 400, 100, 100, 100]} animateWidth={[100, 100, 150, 100]} width={100} duration={5} repeatDelay={1} />
              </div>
            </div>
          )}
        </div>
        <svg className={`relative w-full overflow-hidden z-20 translate-y-1`} preserveAspectRatio="none" x="0px" y="0px" viewBox="0 0 1920 100.1">
          <path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </svg>
      </div>
      <div className="mx-4 my-5">
        <div className="text-center pb-4">
          <h4>Create worldwide events quickly and easily</h4>
          <p className="font-medium text-gray-500">Simple, flexable and easy to make events for friends for all around the world.</p>
        </div>
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-10">
          <div className="w-full md:w-1/3">
            <div className="text-center items-center flex flex-col md:gap-4">
              <div className="flex rounded-full bg-slate-100 text-primary w-16 h-16 items-center justify-center">
                <MousePointerClick size={30} />
              </div>
              <h6 className="font-semibold text-gray-700 text-xl">Built for friends!</h6>
              <p className="text-gray-500">
                TimeLineup was born from frustation.
                online events in varying timezones shouldnt be hard
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="text-center items-center flex flex-col md:gap-4 ">
              <div className="flex rounded-full bg-slate-100 text-primary w-16 h-16 items-center justify-center">
                <CodeXml size={30} />
              </div>
              <h6 className="font-semibold text-gray-700 text-xl">Designed to be easy</h6>
              <p className="text-gray-500">
                Based on simple yet powerful features
                to make event organising blissful
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="text-center items-center flex flex-col md:gap-4">
              <div className="flex rounded-full bg-slate-100 text-primary w-16 h-16 items-center justify-center">
                <UserCheck size={30} className="translate-x-1" />
              </div>
              <h6 className="font-semibold text-gray-700 text-xl">Continuously developing</h6>
              <p className="text-gray-500">Feedback from our users is key and we constantly improve to make things effortless for you</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-white/0 to-blue-50">
        <div className="mx-auto my-0 max-w-2xl py-8 px-4">
          <div className="text-center m-auto">
            <h4>Plan and create events fast</h4>
            <p className="subText pb-4">
              Events are easy to create, intuitive and simple
              with real time notifications so you dont miss a thing
              in any timezone
            </p>
            <div className="flex bg-gray-100 h-32 md:h-64 rounded-lg overflow-hidden justify-center items-center relative">
              <Image className="w-full h-auto" src="/landing/Chat.png" alt="Chat" width={1000} height={1000} />
            </div>
          </div>
        </div>
        <div className="mx-auto my-0 max-w-6xl px-4 flex ">
          <div className="p-2 md:p-8 flex w-full h-auto flex-col ">
            <h4>Powerful and flexible events for all kinds of functions</h4>
            <p className="text-gray-500 text-xl pb-4">
              Whether you&apos;re planning to skype, have a simple call, a game of among us, or a in person party, TimeLineup helps you create the best possible events for your friends.
            </p>
            <div className="flex flex-wrap">
              <div className="text-gray-500 basis-full max-w-full grow-0 md:max-w-1/3 md:basis-1/3 pt-4">
                <span className="text-4xl font-normal text-primary">
                  <AnimatedNumber from={0} to={100} duration={3} />
                </span>
                <p>Create up to 100 events per user.</p>
              </div>
              <div className="text-gray-500 basis-full max-w-full grow-0 md:max-w-1/3 md:basis-1/3 pt-4">
                <span className="text-4xl font-normal text-primary">
                  <AnimatedNumber from={0} to={30} duration={3} />
                </span>
                <p>30 day retention, old expired events are deleted after 30 days.</p>
              </div>
              <div className="text-gray-500 basis-full max-w-full grow-0 md:max-w-1/3 md:basis-1/3 pt-4">
                <span className="text-4xl font-normal text-primary">
                  <AnimatedNumber from={0} to={24} duration={3} />
                </span>
                <p>24 timezones all synced perfectly to events.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full my-8 max-w-6xl flex px-2 mx-auto">
          <div className="flex flex-wrap w-full gap-2 justify-center ">
            <BoxItem index={0}>
              <div className="rounded-lg h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Puzzle size={25} color="white" />
                </div>
                <h6 className="mb-2">Simple</h6>
                <p className="text-gray-500">Designed with simplicity in mind. Create new events in moments.</p>
              </div>
            </BoxItem>
            <BoxItem index={1}>
              <div className="rounded-lg  h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <DraftingCompass size={25} color="white" />
                </div>
                <h6 className="mb-2">Flexible</h6>
                <p className="text-gray-500">Easily re-organise and re-schedule events and attending times with the click of a mouse</p>
              </div>
            </BoxItem>
            <BoxItem index={2}>
              <div className="rounded-lg  h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Brush size={25} color="white" />
                </div>
                <h6 className="mb-2">Customizable</h6>
                <p className="text-gray-500">Events have huge number of options to adjust from date time, agenda and invites.</p>
              </div>
            </BoxItem>
            <BoxItem index={3}>
              <div className="rounded-lg  h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Earth size={25} color="white" />
                </div>
                <h6 className="mb-2">Timezones</h6>
                <p className="text-gray-500">Event times automatically adjust to the timezone you&apos;re in, making time planning easy for you.</p>
              </div>
            </BoxItem>
            <BoxItem index={4}>
              <div className="rounded-lg  h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BadgeCheck size={25} color="white" />
                </div>
                <h6 className="mb-2">Safe</h6>
                <p className="text-gray-500">Old events are deleted and no data is saved long term, data transparency for us is key.</p>
              </div>
            </BoxItem>
            <BoxItem index={5}>
              <div className="rounded-lg  h-full w-full p-8 bg-white shadow-lg">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BellRing size={25} color="white" />
                </div>
                <h6 className="mb-2">Real time</h6>
                <p className="text-gray-500">Whether&apos;s its an event update or users respond to your own event, you&apos;ll get notifications in real time.</p>
              </div>
            </BoxItem>
          </div>
        </div>
        <svg className={`relative w-full overflow-hidden z-20 translate-y-1`} preserveAspectRatio="none" x="0px" y="0px" viewBox="0 0 1920 100.1">
          <path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </svg>
      </div>
      <div className="text-center mx-auto my-8 max-w-6xl px-4 flex justify-center pb-8">
        <div>
          <h4>Get started with TimeLineup today</h4>
          <p className={`font-medium text-xl text-gray-500 mb-8`}>Build simple, easy, flexible and fully customizable events.</p>
          <div className="flex w-full gap-4 justify-center">
            <LoginDialog><Button size={"lg"} className="w-full md:w-auto">Get started</Button></LoginDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
