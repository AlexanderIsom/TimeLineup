import styles from "@/style/Components/DateCard.module.scss";

interface Props {
  heading: string;
}

export default function DateCard(props: Props) {
  return <div className={`${styles.dateCard} rounded-sm`}>{props.heading}</div>;
}
