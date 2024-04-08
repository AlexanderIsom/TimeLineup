import { eachDayOfInterval, eachHourOfInterval, format, formatDate, subMinutes } from "date-fns";

interface Props {
  start: Date;
  end: Date;
}

export default function TimelineNumbers({ start, end }: Props) {
  const daysInRange = eachDayOfInterval({ start: start, end: subMinutes(end, 1) });

  return (
    <div className={"flex"}>
      {daysInRange.map(date => {
        return <DayHeaderAndHours key={formatDate(date, "yy-mm-dd")} date={date} start={start} end={subMinutes(end, 1)} />
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
    <div className="bg-white border-gray-200 border-r border-t w-full">
      <div className="sticky left-0">{format(date, "LLL do")}</div>
      <div className={"sticky top-0 bottom-0 flex w-full h-8 self-end border-y border-gray-200"}>
        {numberList.map((hour: Date, index: number) => {
          return (
            <div className={"flex-1 h-full justify-center items-center bg-white inline-flex border-r border-gray-200"} key={index}>
              <div className={"justify-center text-center font-normal text-base"}>{`${hour.getHours()}:00`}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
