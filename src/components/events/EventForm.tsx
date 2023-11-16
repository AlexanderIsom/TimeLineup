import React, { useState } from "react";
import { useFloating } from "@floating-ui/react";
import styles from "@/styles/Components/Events/EventForm.module.scss";
import { addMinutes, differenceInMinutes, isFuture, isToday, isWithinInterval, roundToNearestMinutes } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AgendaItem, EventData, User } from "@/lib/types/Events";
import { cloneDeep } from "lodash";
import { nanoid } from "nanoid";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  users: Array<User>;
  eventId?: string;
};

const defaultEvent = () => {
  const newEvent = {} as EventData;
  newEvent.startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 5 });
  newEvent.startDateTime = roundToNearestMinutes(addMinutes(newEvent.startDateTime, 30), { nearestTo: 5 });
  newEvent.duration = 30;
  newEvent.agenda = [{ description: "", start: newEvent.startDateTime, end: addMinutes(newEvent.startDateTime, newEvent.duration), id: nanoid(8) }] as AgendaItem[];
  newEvent.invites = [];
  return newEvent;
};

export default function EventForm(props: Props) {
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom",
    strategy: "fixed",
  });

  const [event, setEvent] = useState<EventData>(defaultEvent);

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const resetEvent = () => {
    setEvent(defaultEvent);
  };

  const filterPassedDates = (date: Date) => {
    return isToday(date) || isFuture(date);
  };

  const filterPassedTimeWithOffset = (time: Date) => {
    const selectedDate = new Date(time);
    return addMinutes(event.startDateTime, 30).getTime() <= selectedDate.getTime();
  };

  const filterTimeBetweenStartAndEnd = (time: Date) => {
    return isWithinInterval(time, { start: event.startDateTime, end: addMinutes(event.startDateTime, event.duration) });
  };

  const removeUserInvite = (user: User) => {
    const updatedEvent = cloneDeep(event);
    const updatedInvites = event.invites.filter((i) => i !== user);
    updatedEvent.invites = updatedInvites;
    setEvent(updatedEvent);
  };

  const addUserInvites = (user: User) => {
    const updatedEvent = cloneDeep(event);
    updatedEvent.invites.push(user);
    setEvent(updatedEvent);
  };

  const addAgendaItem = () => {
    const newEvent = cloneDeep(event);
    newEvent.agenda.push({ description: "", start: event.startDateTime, end: addMinutes(event.startDateTime, event.duration), id: nanoid(8) });
    setEvent(newEvent);
  };

  const removeAgendaItem = (id: string) => {
    const newEvent = cloneDeep(event);
    const updatedAgenda = newEvent.agenda.filter((a) => a.id !== id);
    newEvent.agenda = updatedAgenda;
    setEvent(newEvent);
  };

  const updateAgendaItem = (id: string, startDate: Date, endDate: Date) => {
    const newEvent = cloneDeep(event);
    const index = newEvent.agenda.findIndex((i) => i.id === id);
    newEvent.agenda[index].start = startDate;
    newEvent.agenda[index].end = endDate;
    setEvent(newEvent);
  };

  const saveEvent = () => {
    const id = props.eventId !== undefined ? props.eventId : nanoid(8);
    try {
      const eventClone = cloneDeep(event);
      eventClone._id = id;
      eventClone.user = {
        _id: "demouser",
        name: "demouser",
        emailVerified: new Date(),
        image: "demo",
      };
      eventClone.eventResponse = [];

      const eventString = localStorage.getItem("events");
      var events: EventData[] = [];
      if (eventString !== undefined && eventString !== null) {
        events = JSON.parse(eventString);
      }

      events.push(eventClone);
      const newEventString = JSON.stringify(events);
      localStorage.setItem("events", newEventString);
      console.log("saved locally");
      props.onSave();
    } catch (error) {
      console.error("Failed to store data in localStorage", error);
    }
  };

  if (props.isVisible) {
    return (
      <div ref={refs.setReference} className={styles.wrapper}>
        <div className={styles.formContainer}>
          <div className={styles.info}>
            <input
              type="text"
              placeholder="Title..."
              className={styles.title}
              onChange={(changeEvent) => {
                const updatedEvent = cloneDeep(event);
                updatedEvent.title = changeEvent.target.value;
                setEvent(updatedEvent);
              }}
            />
            <textarea
              placeholder="Description..."
              className={styles.description}
              onChange={(changeEvent) => {
                const updatedEvent = cloneDeep(event);
                updatedEvent.description = changeEvent.target.value;
                setEvent(updatedEvent);
              }}
            />
            <div className={styles.dates}>
              <div className={styles.container}>
                <small className={styles.dateHeading}>from</small>
                <DatePicker
                  wrapperClassName={styles.datePicker}
                  selected={event.startDateTime}
                  onChange={(date: Date) => {
                    const newStartDate = roundToNearestMinutes(date, { nearestTo: 5 });
                    const newEndDate = addMinutes(event.startDateTime, event.duration);
                    const updatedEvent = cloneDeep(event);
                    updatedEvent.startDateTime = newStartDate;
                    updatedEvent.duration = Math.max(differenceInMinutes(newEndDate, newStartDate), 30);
                    setEvent(updatedEvent);
                  }}
                  showTimeSelect
                  timeIntervals={5}
                  filterDate={filterPassedDates}
                  filterTime={filterPassedTime}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
              <div className={styles.container}>
                <small className={styles.dateHeading}>to</small>
                <DatePicker
                  wrapperClassName={styles.datePicker}
                  selected={addMinutes(event.startDateTime, event.duration)}
                  onChange={(date: Date) => {
                    const difference = differenceInMinutes(roundToNearestMinutes(date, { nearestTo: 5 }), event.startDateTime);
                    const updatedEvent = cloneDeep(event);
                    updatedEvent.duration = difference;
                    setEvent(updatedEvent);
                  }}
                  showTimeSelect
                  timeIntervals={5}
                  filterDate={filterPassedDates}
                  filterTime={filterPassedTimeWithOffset}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
            </div>
            <div className={styles.userInvites}>
              <div className={styles.userContainer}>
                {props.users
                  .filter((u) => !event.invites.find((i) => i === u))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((user, index) => {
                    return (
                      <div key={index} className={styles.userInviteButton}>
                        {user.name}{" "}
                        <div
                          className={styles.addButton}
                          onClick={() => {
                            addUserInvites(user);
                          }}
                        >
                          +
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className={styles.userContainer}>
                {event.invites
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((user, index) => {
                    return (
                      <div key={index} className={styles.userInviteButton}>
                        {user.name}{" "}
                        <div
                          className={styles.removeButton}
                          onClick={() => {
                            removeUserInvite(user);
                          }}
                        >
                          -
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={styles.agenda}>
            <p className={styles.agendaHeading}>Agenda</p>
            <div className={styles.agendaList}>
              {event.agenda.map((item, index) => {
                return (
                  <div key={item.id} className={styles.agendaItemContainer}>
                    <input type="text" placeholder="Item name..." className={styles.title} />
                    <div className={styles.agendaItemDateContainer}>
                      <DatePicker
                        wrapperClassName={styles.datePicker}
                        selected={item.start}
                        onChange={(date: Date) => {
                          updateAgendaItem(item.id!, date, item.end);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        filterTime={filterTimeBetweenStartAndEnd}
                        dateFormat="h:mm aa"
                      />
                      -
                      <DatePicker
                        wrapperClassName={styles.datePicker}
                        selected={item.end}
                        onChange={(date: Date) => {
                          updateAgendaItem(item.id!, item.start, date);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        filterTime={filterTimeBetweenStartAndEnd}
                        dateFormat="h:mm aa"
                      />
                      <div
                        className={styles.removeButton}
                        onClick={() => {
                          removeAgendaItem(item.id!);
                        }}
                      >
                        -
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                className={styles.addButton}
                onClick={() => {
                  addAgendaItem();
                }}
              >
                +
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              props.onClose();
              resetEvent();
            }}
          >
            Close
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              saveEvent();
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
  return <></>;
}
