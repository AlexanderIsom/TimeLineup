import Timeline from "@/utils/Timeline";
import { eachDayOfInterval, eachHourOfInterval, format, formatDate } from "date-fns";
import styles from "./TimelineNumbers.module.scss"
import { ForwardedRef, Ref } from "react";

interface Props {
  start: Date;
  end: Date;
  forwardedRef: ForwardedRef<HTMLDivElement>
}

export default function TimelineNumbers({ start, end, forwardedRef }: Props) {
  const daysInRange = eachDayOfInterval({ start: start, end: end });

  return (
    <div className={`sticky top-0 z-10 ${styles.wrapper}`} ref={forwardedRef}>
      {daysInRange.map(date => {
        return <DayHeaderAndHours key={formatDate(date, "yy-mm-dd")} date={date} start={start} end={end} />
      })}
    </div>
  );
}

interface DayHeaderAndHoursProps {
  date: Date,
  start: Date,
  end: Date,
}

function DayHeaderAndHours({ date, start, end }: DayHeaderAndHoursProps) {
  let startTime = new Date(date.setHours(0, 0, 0, 0))
  let endTime = new Date(date.setHours(23, 59, 59, 999));
  if (startTime < start) {
    startTime = start
  }
  if (endTime > end) {
    endTime = end;
  }
  const numberList = eachHourOfInterval({ start: startTime, end: endTime });
  return (
    <div className="bg-white border-gray-200 border-t min-w-max">
      <span className="sticky left-0 right-0 px-8">{format(date, "LLL do")}</span>
      <div className={"flex w-full h-8 self-end border-y border-gray-200"}>
        {numberList.map((hour: Date, index: number) => {
          return (
            <div className={`flex-1 h-full justify-center items-center bg-white inline-flex border-r border-gray-200 w-[${Timeline.getCellWidth()}px]`} key={index}>
              <div className={"justify-center text-center font-normal text-base"}>{`${hour.getHours()}:00`}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
