import styles from "@/styles/Components/TimeCard.module.scss";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

interface Props {
  width: number;
  initialX: number;
  animateX: Array<number>;
  animateWidth?: Array<number>;
  duration: number;
  delay?: number;
  repeatDelay: number;
}

const minutesIncrements = 20;

export default function AnimatedTimeCard(props: Props) {
  const translateXValue = useMotionValue(props.initialX);
  const widthValue = useMotionValue(props.width);
  const [currentX, setCurrentX] = useState(Math.round(Math.round(translateXValue.get()) / minutesIncrements));
  const [currentWidth, setCurrentWidth] = useState(Math.round(Math.round(widthValue.get()) / minutesIncrements));

  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0);

  useMotionValueEvent(translateXValue, "change", (latest) => {
    setCurrentX(Math.round(latest) / minutesIncrements);
  });

  useMotionValueEvent(widthValue, "change", (latest) => {
    setCurrentWidth(Math.round(latest) / minutesIncrements);
  });

  return (
    <div>
      <motion.div
        style={{ x: translateXValue, width: widthValue }}
        animate={{
          x: props.animateX,
          width: props.animateWidth !== undefined ? props.animateWidth : props.width,
        }}
        initial={{ x: props.initialX }}
        transition={{
          ease: "anticipate",
          repeat: Infinity,
          delay: props.delay,
          duration: props.duration,
          repeatType: "mirror",
          repeatDelay: props.repeatDelay,
        }}
      >
        <div className={styles.container} style={{ width: "100%" }}>
          <div className={`${styles.timeContainer}`}>
            <span className={styles.timeCue}>
              {format(
                roundToNearestMinutes(addMinutes(startTime, currentX * 5), {
                  nearestTo: 5,
                }),
                "HH:mm"
              )}
            </span>
            <span className={styles.timeCue}>{format(roundToNearestMinutes(addMinutes(startTime, (currentX + currentWidth) * 5), { nearestTo: 5 }), "HH:mm")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
