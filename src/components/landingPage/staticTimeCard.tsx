import styles from "@/style/Components/TimeCard.module.scss"

export default function StaticTimeCard(){
    return (<div className={styles.container} style={{width: "100%"}}>
            <div className={`${styles.timeContainer}`}>
                <span className={styles.timeCue}>9:15</span>
                <span className={styles.timeCue}>12:30</span>
            </div>
        </div>)
}