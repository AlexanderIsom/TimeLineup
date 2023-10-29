import styles from "@/style/Components/TimeCard.module.scss"

export default function StaticTimeCard(){
    return (<div className={styles.container} style={{width: "100%"}}>
            <div className={`${styles.timeContainer}`}></div>
        </div>)
}