'use client'

import { UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import './styles.scss'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {TbClick, TbCode, TbUserCheck} from "react-icons/tb"

export default function Home() {
	const { isSignedIn, user, isLoaded } = useUser();

	return (
    <main className={"main"}>
      <div className={"backgroundFade"}>
        <div className={`${"titleContainer"}`}>
          <div className={`${"margin"} py-16 px-4`}>
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
      <div className="margin py-16 px-4">
        <div className="text-center pb-4 ">
          <h4>Create worldwide events quickly and easily</h4>
          <p className="pSubText">
            Simple, flexable and easy to make events for friends for all around the world.
          </p>
        </div>
        <div className="flex flex-row">
        <div className="pl-4 pt-4 w-full">
            <div className='gap-4 text-center items-center flex flex-col'>
              <div className="flex rounded-full svgIconContainer ">
                <TbClick size={30} />
              </div>
              <p className="font-semibold text-xl">Built for friends!</p>
              <p className='iconSubText'>
                TimeLineup was born from frustation.
                <br /> online events in varying timezones shouldnt be hard
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full">
            <div className='gap-4 text-center items-center flex flex-col'>
              <div className="flex rounded-full svgIconContainer ">
                <TbCode size={30} />
              </div>
              <p className="font-semibold text-xl">Designed to be easy</p>
              <p className='iconSubText'>
                Based on simple yet powerful features
                <br /> to make event organising blissful
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 w-full">
            <div className='gap-4 text-center items-center flex flex-col'>
              <div className="flex rounded-full svgIconContainer ">
                <TbUserCheck size={30} />
              </div>
              <p className="font-semibold text-xl">Continuously developing</p>
              <p className='iconSubText'>
                Feeback from our users is key and we constantly improve to make things effortless for you
              </p>
            </div>
          </div>          
        </div>
      </div>
    </main>
  );
}
