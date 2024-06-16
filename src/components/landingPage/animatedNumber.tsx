"use client";
import { animate, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
	from: number;
	to: number;
	duration: number;
	delay?: number;
	children?: ReactNode;
}

export default function AnimatedNumber(props: Props) {
	const [current, setCurrent] = useState<number>(props.from);
	const divRef = useRef(null);
	const isInView = useInView(divRef, { once: true, amount: "all" });

	useEffect(() => {
		const controls = animate(props.from, props.to, {
			duration: props.duration,
			onUpdate(value) {
				setCurrent(Math.round(value));
			},
			ease: [0.32, 1, 0, 1],
			delay: props.delay ? props.delay : 0,
			autoplay: false,
		});

		if (isInView) {
			controls.play();
		}

		return () => controls.stop();
	}, [props, isInView]);

	return (
		<div ref={divRef} className="flex h-fit w-fit">
			{current}
			{props.children}
		</div>
	);
}
