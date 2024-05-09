"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, BellRing, Brush, CodeXml, DraftingCompass, Earth, MousePointerClick, Puzzle, UserCheck } from "lucide-react"
// import "./styles.scss"

import BoxItem from "@/components/landingPage/BoxItem";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimatedTimeCard from "@/components/landingPage/animatedTimeCard";
import { useEffect, useRef, useState } from "react";
import DateCard from "@/components/landingPage/dateCard";
import { motion } from "framer-motion";
import LoginDialog from "@/components/login/loginDialog";

import styles from "./styles.module.scss"

export default function Home() {
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
    <div className={styles.main}>
      <div className={styles.backgroundFade}>
        <div className={`${styles.titleContainer}`}>
          <div className={styles.margin}>
            <div className={styles.titles}>
              <h2>
                Make your events
                <br />
                actually <span className={styles.titleHighlight}>happen.</span>
              </h2>
              <p className={styles.titleDescription}>Timelineup allows you to plan out events for anyone anywhere in any timezone.</p>
              <div className={`flex w-full gap-4 ${styles.buttonsContainer}`}>
                <LoginDialog><Button size={"lg"}>Get started</Button></LoginDialog>
              </div>
            </div>
          </div>
          <div className={styles.titleImage} ref={animatedDivContainer} >
            {isAnimatiedDivShown && (
              <div className={`${styles.animatedEventCardsContainer} flex flex-col`}>
                <div>
                  <AnimatedTimeCard initialX={20} animateX={[20, 200]} width={300} duration={1} repeatDelay={2} />
                </div>

                <div>
                  <AnimatedTimeCard initialX={40} animateX={[40, 200, 200, 200, 100]} animateWidth={[200, 400, 400, 300, 300]} width={200} duration={2.5} repeatDelay={2} />
                </div>

                <div>
                  <AnimatedTimeCard initialX={400} animateX={[400, 700, 280, 160, 20]} animateWidth={[380, 220, 220, 360, 360]} width={400} delay={1.5} duration={4} repeatDelay={2} />
                </div>

                <div>
                  <AnimatedTimeCard initialX={500} animateX={[500, 500, 200, -100, 180, 500]} width={800} duration={3} repeatDelay={2} />
                </div>

                <div>
                  <AnimatedTimeCard initialX={400} animateX={[400, 200, 400, 100, 100, 100]} animateWidth={[100, 100, 150, 100]} width={100} duration={5} repeatDelay={1} />
                </div>
              </div>
            )}
          </div>
        </div>
        <svg className={styles.svgBlocker} preserveAspectRatio="none" x="0px" y="0px" viewBox="0 0 1920 100.1">
          <path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </svg>
      </div>
      <div className={styles.margin}>
        <div className="text-center pb-4">
          <h4>Create worldwide events quickly and easily</h4>
          <p className="subText">Simple, flexable and easy to make events for friends for all around the world.</p>
        </div>
        <div className={`flex ${styles.descirptionsIconsGrid}`}>
          <div className="pl-4 pt-4 pr-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className={`flex rounded-full ${styles.svgIconContainer} `}>
                <MousePointerClick size={30} />
              </div>
              <h6 className="font-regular text-xl">Built for friends!</h6>
              <p className={styles.iconSubText}>
                TimeLineup was born from frustation.
                <br /> online events in varying timezones shouldnt be hard
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 pr-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className={`flex rounded-full ${styles.svgIconContainer} `}>
                <CodeXml size={30} />
              </div>
              <h6 className="font-regular text-xl">Designed to be easy</h6>
              <p className="iconSubText">
                Based on simple yet powerful features
                <br /> to make event organising blissful
              </p>
            </div>
          </div>
          <div className="pl-4 pt-4 pr-4 w-full md:w-1/3">
            <div className="gap-4 text-center items-center flex flex-col">
              <div className={`flex rounded-full ${styles.svgIconContainer} `}>
                <UserCheck size={30} />
              </div>
              <h6 className="font-regular text-xl">Continuously developing</h6>
              <p className={styles.iconSubText}>Feedback from our users is key and we constantly improve to make things effortless for you</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.lowerSection}>
        <div className={`${styles.margin} ${styles.middle}`}>
          <div className="text-center m-auto">
            <h4>Plan and create events fast</h4>
            <p className="subText pb-4">
              Events are easy to create, intuitive and simple
              <br />
              with real time notifications so you dont miss a thing
              <br />
              in any timezone
            </p>
            <div className="flex bg-gray-100 h-64 rounded-lg overflow-hidden justify-center items-center relative">
              <img className={styles.chatImage} src="/landing/Chat.png" alt="Chat" width={1000} height={1000} />
            </div>
          </div>
        </div>
        <div className={styles.margin}>
          <div>
            <div className="flex">
              <div className={`pl-8 pt-8 pr-8 ${styles.animatedEventInfoDescription}`}>
                <h4>Powerful and flexible events for all kinds of functions</h4>
                <p className={styles.subText}>
                  Whether you&apos;re planning to skype, have a simple call, a game of among us, or a in person party, TimeLineup helps you create the best possible events for your friends.
                </p>
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <span className={styles.statsHeader}>
                      <AnimatedNumber from={0} to={100} duration={3} />
                    </span>
                    <p>Create up to 100 events per user.</p>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statsHeader}>
                      <AnimatedNumber from={0} to={30} duration={3} />
                    </span>
                    <p>30 day retention, old expired events are deleted after 30 days.</p>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statsHeader}>
                      <AnimatedNumber from={0} to={24} duration={3} />
                    </span>
                    <p>24 timezones all synced perfectly to events.</p>
                  </div>
                </div>
              </div>
              <div className={`pl-8 pt-8 ${styles.flexItem} w-full ${styles.animatedEventInfoCardContainer}`}>
                {isAnimatiedDivShown && (
                  <div className={`w-full h-full ${styles.animatedEventInfoCard} rounded-lg overflow-hidden `}>
                    <motion.div className="h-1 w-full gap-4 pl-4 pr-4 flex" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 1 }}>
                      <motion.div
                        className="h-fit"
                        style={{ width: "50%", height: "300px" }}
                        variants={{
                          offscreen: {
                            y: -250,
                          },
                          onscreen: {
                            y: -100,
                            transition: {
                              type: "spring",
                              bounce: 0.4,
                              duration: 1,
                            },
                          },
                        }}
                      >
                        <DateCard heading="Release party" subtext="Thursday 5 pm to 1 am" cancelled={2} attending={20} invited={7} />
                      </motion.div>

                      <motion.div
                        className="h-fit w-fit"
                        style={{ width: "50%", height: "300px" }}
                        variants={{
                          offscreen: {
                            y: 270,
                          },
                          onscreen: {
                            y: 120,
                            transition: {
                              type: "spring",
                              bounce: 0.4,
                              duration: 1.2,
                              delay: 0.1,
                            },
                          },
                        }}
                      >
                        <DateCard heading="Wine tasting night!" reversed={true} subtext="Friday 5 pm to 8 pm" cancelled={1} attending={5} invited={2} />
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.margin}>
          <div className={`${styles.animatedCardsContainer} justify-center`}>
            <BoxItem index={0}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Puzzle size={25} color="white" />
                </div>
                <h6 className="mb-2">Simple</h6>
                <p className={styles.boxDescription}>Designed with simplicity in mind. Create new events in moments.</p>
              </div>
            </BoxItem>
            <BoxItem index={1}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <DraftingCompass size={25} color="white" />
                </div>
                <h6 className="mb-2">Flexible</h6>
                <p className={styles.boxDescription}>Easily re-organise and re-schedule events and attending times with the click of a mouse</p>
              </div>
            </BoxItem>
            <BoxItem index={2}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Brush size={25} color="white" />
                </div>
                <h6 className="mb-2">Customizable</h6>
                <p className={styles.boxDescription}>Events have huge number of options to adjust from date time, agenda and invites.</p>
              </div>
            </BoxItem>
            <BoxItem index={3}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Earth size={25} color="white" />
                </div>
                <h6 className="mb-2">Timezones</h6>
                <p className={styles.boxDescription}>Event times automatically adjust to the timezone you&apos;re in, making time planning easy for you.</p>
              </div>
            </BoxItem>
            <BoxItem index={4}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BadgeCheck size={25} color="white" />
                </div>
                <h6 className="mb-2">Safe</h6>
                <p className={styles.boxDescription}>Old events are deleted and no data is saved long term, data transparency for us is key.</p>
              </div>
            </BoxItem>
            <BoxItem index={5}>
              <div className={`rounded-lg  h-full w-full p-8 ${styles.animatedCardBackground}`}>
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BellRing size={25} color="white" />
                </div>
                <h6 className="mb-2">Real time</h6>
                <p className={styles.boxDescription}>Whether&apos;s its an event update or users respond to your own event, you&apos;ll get notifications in real time.</p>
              </div>
            </BoxItem>
          </div>
        </div>
        <svg className={styles.svgBlocker} preserveAspectRatio="none" x="0px" y="0px" viewBox="0 0 1920 100.1">
          <path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </svg>
      </div>
      <div className={`text-center ${styles.margin}`}>
        <div>
          <h4>Get started with TimeLineup today</h4>
          <p className={`${styles.subText} mb-8`}>Build simple, easy, flexible and fully customizable events.</p>
          <div className="flex w-full gap-4 justify-center">
            <LoginDialog><Button size={"lg"} className={styles.footerButton}>Get started</Button></LoginDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
