import styles from "./Blocker.module.scss"

export enum Side {
	left, right
}

interface Props {
	width: number
	side: Side
}


export default function Blocker(props: Props) {
	return <div
		style={{ width: `${props.width}px` }}
		className={`absolute h-full ${props.side === Side.right && "right-0"} ${styles.blocker}`}></div>
}