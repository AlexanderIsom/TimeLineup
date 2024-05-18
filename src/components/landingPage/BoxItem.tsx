import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface Props {
  index: number;
  children?: ReactNode;
}

export default function BoxItem(props: Props) {
  const cardVariants: Variants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "linear",
        duration: 0.75,
        delay: props.index * 0.1,
      },
    },
  };

  return (
    <motion.div className="grow-0 md:basis-3/12 md:max-w-3/12" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.8 }} variants={cardVariants}>
      {props.children}
    </motion.div>
  );
}
