import styles from "@/style/Components/TimeCard.module.scss";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

interface Props {
  width: number;
  initialX: number;
  animateX: Array<number>;
  animateWidth?: Array<number>;
  duration: number;
  delay?: number;
  repeatDelay: number;
}

export default function AnimatedTimeCard(props: Props) {
  const translateXValue = useMotionValue(props.initialX);
  const widthValue = useMotionValue(props.width);
  const [currentX, setCurrentX] = useState(props.initialX);
  const [currentWidth, setCurrentWidth] = useState(props.width);

  useMotionValueEvent(translateXValue, "change", (latest) => {
    setCurrentX(latest);
  });

  useMotionValueEvent(widthValue, "change", (latest) => {
    setCurrentWidth(latest);
  });

  return (
    <div>
      <motion.div
        style={{ x: translateXValue, width: widthValue }}
        animate={{
          x: props.animateX,
          width:
            props.animateWidth !== undefined ? props.animateWidth : props.width,
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
            <span className={styles.timeCue}>{Math.round(currentX)}</span>
            <span className={styles.timeCue}>
              {Math.round(currentX) + Math.round(currentWidth)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
