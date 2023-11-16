import styles from "@/styles/Components/DateCard.module.scss";

interface Props {
  heading: string;
  subtext: string;
  reversed?: boolean;
  attending: number;
  invited: number;
  cancelled: number;
}

export default function DateCard(props: Props) {
  return (
    <div className={`${styles.dateCard} rounded-xl pt-4 pb-4 flex ${props.reversed ? "flex-col-reverse" : "flex-col"} justify-end text-center`}>
      <div className="flex text-center w-full pl-4 pt-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="w-2 h-full bg-green-400 rounded-full" />
            <p className="text-sm">attedning: {props.attending}</p>
          </div>

          <div className="flex gap-2">
            <div className="w-2 h-full bg-amber-300 rounded-full" />
            <p className="text-sm">invited: {props.invited}</p>
          </div>

          <div className="flex gap-2 ">
            <div className="w-2 h-full bg-rose-600 rounded-full" />
            <p className="text-sm">declined: {props.cancelled}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className={styles.header}>{props.heading}</p>
        <p className="text-xs">{props.subtext}</p>
      </div>
    </div>
  );
}
