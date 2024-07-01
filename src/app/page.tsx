import { Button } from "@/components/ui/button";
import {
	BadgeCheck,
	BellRing,
	Brush,
	CodeXml,
	DraftingCompass,
	Earth,
	MousePointerClick,
	Puzzle,
	UserCheck,
} from "lucide-react";

import BoxItem from "@/components/landingPage/BoxItem";
import AnimatedNumber from "@/components/landingPage/animatedNumber";
import AnimatedTimeCard from "@/components/landingPage/animatedTimeCard";
import Image from "next/image";
import QueryButton from "@/components/queryButton";

export default function Home() {
	return (
		<div className="md:pt-16">
			<div className="overflow-x-clip bg-gradient-to-b from-white/0 to-blue-50">
				<div className="mx-auto flex max-w-6xl">
					<div className="z-20 mx-auto grow-0 px-4 py-8 md:px-16 md:py-16">
						<span className="text-5xl font-bold md:text-7xl">
							Make your events
							<br />
							actually{" "}
							<span className="bg-gradient-to-b from-transparent from-[82%] via-orange-300 via-[82%] to-orange-300 text-primary">
								happen.
							</span>
						</span>
						<p className="w-full py-8 text-xl font-normal leading-6 md:text-2xl">
							Timelineup allows you to plan out events for anyone anywhere in any timezone.
						</p>
						<div className="flex w-full flex-col gap-4 md:flex-row">
							<QueryButton value="login" size={"lg"}>
								Get started
							</QueryButton>
						</div>
					</div>
					<div className="z-10 hidden h-auto w-1/4 -translate-x-56 rotate-[-15deg] md:block">
						<div className="flexm h-full w-[500px] flex-col bg-[linear-gradient(to_right,#c6c6c6_1px,transparent_1px),linear-gradient(to_bottom,#c6c6c6_1px,transparent_1px)] bg-[size:60px_100px]">
							<AnimatedTimeCard
								initialX={20}
								animateX={[20, 200]}
								width={300}
								duration={1}
								repeatDelay={2}
							/>
							<AnimatedTimeCard
								initialX={100}
								animateX={[200, 500, 280, 160, -50]}
								animateWidth={[380, 220, 220, 360, 360]}
								width={400}
								delay={1.5}
								duration={4}
								repeatDelay={2}
							/>
							<AnimatedTimeCard
								initialX={50}
								animateX={[100, 100, 30, -50, 180, 120]}
								width={300}
								duration={3}
								repeatDelay={2}
							/>
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
				</div>
				<svg
					className={`relative z-20 w-full translate-y-1 overflow-hidden`}
					preserveAspectRatio="none"
					x="0px"
					y="0px"
					viewBox="0 0 1920 100.1"
				>
					<path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
				</svg>
			</div>
			<div className="mx-4 my-5">
				<div className="pb-4 text-center">
					<h4>Create worldwide events quickly and easily</h4>
					<p className="font-medium text-gray-500">
						Simple, flexable and easy to make events for friends for all around the world.
					</p>
				</div>
				<div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row">
					<div className="w-full md:w-1/3">
						<div className="flex flex-col items-center text-center md:gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-primary">
								<MousePointerClick size={30} />
							</div>
							<h6 className="text-xl font-semibold text-gray-700">Built for friends!</h6>
							<p className="text-gray-500">
								TimeLineup was born from frustation. online events in varying timezones shouldnt be hard
							</p>
						</div>
					</div>
					<div className="w-full md:w-1/3">
						<div className="flex flex-col items-center text-center md:gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-primary">
								<CodeXml size={30} />
							</div>
							<h6 className="text-xl font-semibold text-gray-700">Designed to be easy</h6>
							<p className="text-gray-500">
								Based on simple yet powerful features to make event organising blissful
							</p>
						</div>
					</div>
					<div className="w-full md:w-1/3">
						<div className="flex flex-col items-center text-center md:gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-primary">
								<UserCheck size={30} className="translate-x-1" />
							</div>
							<h6 className="text-xl font-semibold text-gray-700">Continuously developing</h6>
							<p className="text-gray-500">
								Feedback from our users is key and we constantly improve to make things effortless for
								you
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gradient-to-b from-white/0 to-blue-50">
				<div className="mx-auto my-0 max-w-2xl px-4 py-8">
					<div className="m-auto text-center">
						<h4>Plan and create events fast</h4>
						<p className="subText pb-4">
							Events are easy to create, intuitive and simple with real time notifications so you dont
							miss a thing in any timezone
						</p>
						<div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100 md:h-64">
							<Image
								className="h-auto w-full"
								src="/landing/Chat.png"
								alt="Chat"
								width={1000}
								height={1000}
							/>
						</div>
					</div>
				</div>
				<div className="mx-auto my-0 flex max-w-6xl px-4">
					<div className="flex h-auto w-full flex-col p-2 md:p-8">
						<h4>Powerful and flexible events for all kinds of functions</h4>
						<p className="pb-4 text-xl text-gray-500">
							Whether you&apos;re planning to skype, have a simple call, a game of among us, or a in
							person party, TimeLineup helps you create the best possible events for your friends.
						</p>
						<div className="flex flex-wrap">
							<div className="md:max-w-1/3 max-w-full grow-0 basis-full pt-4 text-gray-500 md:basis-1/3">
								<span className="text-4xl font-normal text-primary">
									<AnimatedNumber from={0} to={100} duration={3} />
								</span>
								<p>Create up to 100 events per user.</p>
							</div>
							<div className="md:max-w-1/3 max-w-full grow-0 basis-full pt-4 text-gray-500 md:basis-1/3">
								<span className="text-4xl font-normal text-primary">
									<AnimatedNumber from={0} to={30} duration={3} />
								</span>
								<p>30 day retention, old expired events are deleted after 30 days.</p>
							</div>
							<div className="md:max-w-1/3 max-w-full grow-0 basis-full pt-4 text-gray-500 md:basis-1/3">
								<span className="text-4xl font-normal text-primary">
									<AnimatedNumber from={0} to={24} duration={3} />
								</span>
								<p>24 timezones all synced perfectly to events.</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mx-auto my-8 flex w-full max-w-6xl px-2">
					<div className="flex w-full flex-wrap justify-center gap-2">
						<BoxItem index={0}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<Puzzle size={25} color="white" />
								</div>
								<h6 className="mb-2">Simple</h6>
								<p className="text-gray-500">
									Designed with simplicity in mind. Create new events in moments.
								</p>
							</div>
						</BoxItem>
						<BoxItem index={1}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<DraftingCompass size={25} color="white" />
								</div>
								<h6 className="mb-2">Flexible</h6>
								<p className="text-gray-500">
									Easily re-organise and re-schedule events and attending times with the click of a
									mouse
								</p>
							</div>
						</BoxItem>
						<BoxItem index={2}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<Brush size={25} color="white" />
								</div>
								<h6 className="mb-2">Customizable</h6>
								<p className="text-gray-500">
									Events have huge number of options to adjust from date time, agenda and invites.
								</p>
							</div>
						</BoxItem>
						<BoxItem index={3}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<Earth size={25} color="white" />
								</div>
								<h6 className="mb-2">Timezones</h6>
								<p className="text-gray-500">
									Event times automatically adjust to the timezone you&apos;re in, making time
									planning easy for you.
								</p>
							</div>
						</BoxItem>
						<BoxItem index={4}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<BadgeCheck size={25} color="white" />
								</div>
								<h6 className="mb-2">Safe</h6>
								<p className="text-gray-500">
									Old events are deleted and no data is saved long term, data transparency for us is
									key.
								</p>
							</div>
						</BoxItem>
						<BoxItem index={5}>
							<div className="h-full w-full rounded-lg bg-white p-8 shadow-lg">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
									<BellRing size={25} color="white" />
								</div>
								<h6 className="mb-2">Real time</h6>
								<p className="text-gray-500">
									Whether&apos;s its an event update or users respond to your own event, you&apos;ll
									get notifications in real time.
								</p>
							</div>
						</BoxItem>
					</div>
				</div>
				<svg
					className={`relative z-20 w-full translate-y-1 overflow-hidden`}
					preserveAspectRatio="none"
					x="0px"
					y="0px"
					viewBox="0 0 1920 100.1"
				>
					<path fill="#ffffff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
				</svg>
			</div>
			<div className="mx-auto my-8 flex max-w-6xl justify-center px-4 pb-8 text-center">
				<div>
					<h4>Get started with TimeLineup today</h4>
					<p className={`mb-8 text-xl font-medium text-gray-500`}>
						Build simple, easy, flexible and fully customizable events.
					</p>
					<div className="flex w-full justify-center gap-4">
						<QueryButton value="login" size={"lg"} className="w-full md:w-auto">
							Get started
						</QueryButton>
					</div>
				</div>
			</div>
		</div>
	);
}
