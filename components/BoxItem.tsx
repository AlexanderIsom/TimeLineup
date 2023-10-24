import { ReactNode, useRef } from "react"
import { useInView, motion, Variants } from "framer-motion"

interface Props {
    index: number;
    children?: ReactNode
}



export default function BoxItem(props: Props) {
    const cardVariants: Variants = {
        offscreen: {
            y: 50,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "linear",
                duration: 0.75,
                delay: props.index * 0.1
            }
        }
    };

    return <motion.div className="pl-8 pt-8 boxItem"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        variants={cardVariants}
    >{props.children}</motion.div>
}