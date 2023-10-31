"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/sass/styles.scss";
import { useState, useEffect, useContext } from "react";
import { DoctorContext } from "../layout";
import { Doctor } from "@/types";

const localizer = momentLocalizer(moment);

export default function BlogPage() {
  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    React.SetStateAction<Doctor>
  ];
  const [events, setEvents] = useState<
    [{ start?: Date; end?: Date; title?: string }]
  >([{}]);

  const getAppointments = async () => {
    console.log(doctor._id);
    if (doctor._id) {
      try {
        const requestBody = {
          id: doctor._id,
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
          console.log(appointmentsData);
          let newEvents: [{ start?: Date; end?: Date; title?: string }] = [
            ...events,
          ];
          appointmentsData.forEach((appointmentData: any) =>
            newEvents.push({
              start: new Date(appointmentData.createdAt),
              end: new Date(appointmentData.createdAt),
              title: appointmentData.title,
            })
          );
          setEvents(newEvents);
        } else {
          console.log(doctor._id);
          console.log(`invalid response for ${doctor._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAppointments();
  }, [doctor]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        defaultDate={new Date()}
        defaultView="month"
        style={{ height: "100vh", padding: "20px" }}
      />
    </div>
  );
}
