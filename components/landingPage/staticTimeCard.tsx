import styles from "@/style/Components/TimeCard.module.scss"

interface Props{
    width: number,
    transformX: number,
    transformY:number,
}

export default function StaticTimeCard(props:Props){
    return (<div className={styles.container} style={{width: props.width, transform: `translateX(${props.transformX}px) translateY(${props.transformY}px)`}}>
            <div className={`${styles.timeContainer}`}></div>
        </div>)
}