"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/sass/styles.scss";
import { useState, useEffect, useContext, useRef } from "react";
import { PatientContext } from "../layout";
import { Patient } from "@/types";
import EventPopup from "./eventPopup";

const localizer = momentLocalizer(moment);

interface EventProps {
  _id?: string;
  start?: Date;
  end?: Date;
  title?: string;
  doctorName?: string;
  patientName?: string;
  doctorId?: string;
  patientId?: string;
}

export default function PatientCalendar() {
  const [calendarView, setCalendarView] = useState<
    "day" | "month" | "week" | "work_week" | "agenda"
  >("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [currentEvent, setCurrentEvent] = useState<EventProps>({});
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.SetStateAction<Patient>
  ];
  const [events, setEvents] = useState<[EventProps]>([{}]);

  const getAppointments = async () => {
    if (patient._id) {
      try {
        const requestBody = {
          id: patient._id,
        };

        const response = await fetch("http://localhost:8080/appointment/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          mode: "cors",
        });

        if (response.ok) {
          let appointmentsData = await response.json();
          let newEvents: [EventProps] = [...events];
          appointmentsData.forEach((appointmentData: any) => {
            let startTime = new Date(appointmentData.time);
            let endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
            newEvents.push({
              _id: appointmentData._id,
              start: startTime,
              end: endTime,
              title: appointmentData.title,
              patientName: appointmentData.patientName,
              doctorName: appointmentData.doctorName,
              doctorId: appointmentData.doctorId,
              patientId: appointmentData.patientId,
            });
          });
          setEvents(newEvents);
        } else {
        }
      } catch (error) {}
    }
  };

  const checkDeactivated = () => {
    if (
      patient.hasOwnProperty("activeAccount") &&
      patient.activeAccount === false &&
      window.location.pathname !== "/profile"
    ) {
      window.alert(
        "Your Account has been deactivated. Please Re-Activate to use."
      );
      window.location.href = "/profile";
    }
  };

  useEffect(() => {
    checkDeactivated();
    getAppointments();
  }, [patient]);

  type Delta = "month" | "week" | "day" | "work_week" | "agenda";

  function addToDate(date: Date, number: number, delta: Delta): Date {
    const result = new Date(date);
    switch (delta) {
      case "month":
        const desiredMonth = result.getMonth() + number;
        result.setMonth(desiredMonth);
        // Check for month rollover
        if (result.getMonth() !== ((desiredMonth % 12) + 12) % 12) {
          result.setDate(0); // Sets the date to the last day of the previous month
        }
        break;
      case "week":
      case "work_week":
      case "agenda":
        result.setDate(result.getDate() + number * 7);
        break;
      case "day":
        result.setDate(result.getDate() + number);
        break;
      default:
        throw new Error("Invalid delta value");
    }

    return result;
  }

  const handleSelectEvent = (event: EventProps) => {
    setCurrentEvent(event);
  };

  const handleClosePopup = () => {
    setCurrentEvent({});
  };

  function onSave(id: string, title: string, date: Date) {
    let currEvents: [EventProps] = [...events];
    currEvents.forEach((event) => {
      if (event._id == id) {
        event.title = title;
        event.start = date;
        event.end = new Date(date.getTime() + 60 * 60 * 1000);
      }
    });
    setEvents(currEvents);
  }

  function onDelete(id: string) {
    let currEvents: [EventProps] = [...events];
    let allEvents: EventProps[] = [];
    currEvents.forEach((event) => {
      if (event._id != id) {
        allEvents.push(event);
      }
    });
    setEvents((allEvents as [EventProps]) ?? [{}]);
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        date={calendarDate}
        views={["month", "week", "day"]}
        view={calendarView}
        onView={setCalendarView}
        onNavigate={(date, view, action) => {
          if (action == "NEXT") {
            let newDate = addToDate(calendarDate, 1, view);
            setCalendarDate(newDate);
          } else if (action == "PREV") {
            let newDate = addToDate(calendarDate, -1, view);
            setCalendarDate(newDate);
          } else if (action == "TODAY") {
            setCalendarDate(new Date());
          } else if (action == "DATE") {
            setCalendarDate(date);
          }
        }}
        onSelectEvent={handleSelectEvent}
        style={{ height: "100vh", padding: "20px" }}
      />
      {currentEvent && (
        <EventPopup
          event={currentEvent}
          onClose={handleClosePopup}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
