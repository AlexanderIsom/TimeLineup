import { differenceInMinutes, eachDayOfInterval, eachHourOfInterval, format, formatDate, roundToNearestHours } from "date-fns";
import styles from "./TimelineNumbers.module.scss"
import { ForwardedRef } from "react";

interface Props {
  start: Date;
  end: Date;
  minuteWidth: number;
  forwardedRef: ForwardedRef<HTMLDivElement>
}

export default function TimelineNumbers({ start, end, forwardedRef, minuteWidth }: Props) {
  const daysInRange = eachDayOfInterval({ start: start, end: end });
  const ceilStart = roundToNearestHours(start, { roundingMethod: "ceil" })
  const offset = differenceInMinutes(ceilStart, start)

  return (
    <div className={`${styles.wrapper}`} ref={forwardedRef}>
      {daysInRange.map((date, index) => {
        return <DayHeaderAndHours key={formatDate(date, "yy-mm-dd")} date={date} start={ceilStart} end={end} minuteWidth={minuteWidth} dayIndex={index} offset={offset} />
      })}
    </div>
  );
}

interface DayHeaderAndHoursProps {
  date: Date,
  start: Date,
  end: Date,
  minuteWidth: number,
  dayIndex: number,
  offset: number,
}

function DayHeaderAndHours({ date, start, end, minuteWidth, offset, dayIndex }: DayHeaderAndHoursProps) {
  let startTime = new Date(date.setHours(0, 0, 0, 0))
  let endTime = new Date(date.setHours(23, 59, 59, 999));
  if (startTime < start) {
    startTime = start
  }
  if (endTime > end) {
    endTime = end;
  }
  const numberList = eachHourOfInterval({ start: startTime, end: endTime })
  return (
    <div className="h-full border-gray-200 min-w-max">
      <div className="h-1/2 flex items-end">
        <span className="sticky left-0 right-0 px-8">{format(date, "LLL do")}</span>
      </div>

      <div className={"h-1/2 w-full self-end border-t border-gray-200"}>
        {numberList.map((hour: Date, index: number) => {
          return (
            <div className={`flex-1 h-full -translate-x-1/2 justify-center items-center inline-flex border-gray-200 `} style={{ width: `${minuteWidth * 60}px`, marginLeft: `${dayIndex === 0 && index === 0 ? offset * minuteWidth + "px" : "0"}` }} key={index}>
              <div className={"justify-center text-center font-normal text-base"}>{`${hour.getHours()}:00`}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
