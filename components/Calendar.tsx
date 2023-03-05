import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import styles from "../styles/Components/Calendar.module.scss";
import { Cairo } from "@next/font/google";
const cairo = Cairo({ subsets: ["latin"] });

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  formatISO,
  parseISO,
  sub,
} from "date-fns";
import { useState } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function FindEventsForDay(day: Date, events: any[]) {
  const formattedDay = format(day, "yyyy-MM-dd");
  const filteredEvents = events.filter(
    (event) =>
      formatISO(parseISO(event.startDateTime), { representation: "date" }) ==
      formattedDay
  );

  return filteredEvents.length > 0;
}

export default function Calendar({
  events,
  onMonthChanged,
  onSelectedDayChange,
}: any) {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const formattedDay = format(today, "yyyy-MM-dd");

  let days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  function HandleDayChange(day: Date) {
    onSelectedDayChange(day);
    setSelectedDay(day);
  }

  function nextMonth() {
    let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    onMonthChanged();
  }

  function previousMonth() {
    let firstDayOfNextMonth = sub(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    onMonthChanged();
  }

  return (
    <div className={classNames(styles.wrapper, cairo.className)}>
      <div className={styles.paddingRight}>
        <div className={styles.flexCenter}>
          <h2 className={styles.calendarHeader}>
            {format(firstDayOfCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={previousMonth}
            className={styles.chevronButton}
          >
            <ChevronLeftIcon className={styles.chevronIcon} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className={classNames(styles.chevronButton, styles.chevronRight)}
          >
            <ChevronRightIcon className={styles.chevronIcon} />
          </button>
        </div>
        <div className={styles.dayNameGrid}>
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className={styles.datesGrid}>
          {days.map((day, dayIdx) => (
            <div
              key={dayIdx}
              className={classNames(
                styles.gridDateItem,
                dayIdx === 0 && colStartClasses[getDay(day)]
              )}
            >
              <button
                type="button"
                onClick={() => HandleDayChange(day)}
                className={classNames(
                  isEqual(day, selectedDay) && styles.dateItemTextWhite,
                  !isEqual(day, selectedDay) &&
                  isToday(day) &&
                  styles.dateItemIndigo,
                  !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayOfCurrentMonth) &&
                  styles.dateItemGray,
                  !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayOfCurrentMonth) &&
                  styles.dateItemLightGray,
                  isEqual(day, selectedDay) &&
                  isToday(day) &&
                  styles.backgroundIndigo,
                  isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  styles.backgroundGray,
                  !isEqual(day, selectedDay) && styles.hoverItem,
                  (isEqual(day, selectedDay) || isToday(day)) &&
                  styles.fontSemi,
                  styles.other,
                  FindEventsForDay(day, events) && styles.hasEvents
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

let colStartClasses = [
  styles.colStartOne,
  styles.colStartTwo,
  styles.colStartThree,
  styles.colStartFour,
  styles.colStartFive,
  styles.colStartSix,
  styles.colStartSeven,
];
