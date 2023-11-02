"use client";
import { useRef, useEffect, useState } from "react";
import moment from "moment";
import "../calendar/event.css";
import { start } from "repl";

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

export default function EventPopup({
  event,
  onClose,
  onSave,
  onDelete,
}: {
  event: EventProps | null;
  onClose: () => void;
  onSave: (id: string, title: string, date: Date) => void;
  onDelete: (id: string) => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  // Step 1: Update the State
  const [title, setTitle] = useState<string>(event?.title ?? "");
  const [startTime, setStartTime] = useState<Date>(event?.start ?? new Date());

  async function updateAppointment(id: string, title: string, date: Date) {
    if (event?._id == id) {
      event.title = title;
      event.start = date;
    }
    try {
      const requestBody = {
        appointmentId: id,
        edit: {
          title: title,
          time: date,
        },
      };

      const response = await fetch("http://localhost:8080/appointment/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAppointment(
    id?: string,
    doctorId?: string,
    patientId?: string
  ) {
    if (id && doctorId && patientId) {
      onClose();
      onDelete(id);
      try {
        const requestBody = {
          appointmentId: id,
          doctorId: doctorId,
          patientId: patientId,
        };

        const response = await fetch(
          "http://localhost:8080/appointment/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            mode: "cors",
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setTitle(event?.title ?? "");
    setStartTime(event?.start ?? new Date());
  }, [event]);

  const formatDate = (date?: Date) => {
    return date ? moment(date).format("dddd, MMMM D") : "";
  };

  const toggleEditing = () => {
    if (editing) {
      handleSave();
    }
    setEditing(!editing);
  };

  const handleInputChange = (field: keyof EventProps, value: string | Date) => {
    if (field == "title" && typeof value == "string") {
      setTitle(value);
    }
    if (field == "start" && value instanceof Date) {
      setStartTime(value);
    }
  };

  const handleSave = () => {
    if (event?._id) {
      onSave(event?._id, title, startTime);
      updateAppointment(event._id, title, startTime);
    }
  };

  const formatTimeRange = (start?: Date, end?: Date) => {
    if (!start || !end) return "";
    const startTime = moment(start).format("h:mm A");
    const endTime = moment(end).format("h:mm A");
    return `${startTime} – ${endTime}`;
  };

  if (!event || !event.title || !event.start || !event.end) return null;

  return (
    <div className="event-popup-overlay">
      <div className="event-popup" ref={popupRef}>
        <div className="flex justify-between pb-5">
          <div
            className="opacity-100 transition duration-300 cursor-pointer"
            onClick={() => {
              toggleEditing();
            }}
          >
            {!editing && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="24px"
                height="24px"
              >
                <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z" />
              </svg>
            )}
            {editing && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="24px"
                height="24px"
              >
                <path d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z" />
              </svg>
            )}
          </div>
          <div
            className="h-[24px] w-[24px] opacity-100 transition duration-300 cursor-pointer"
            onClick={() => {
              deleteAppointment(event._id, event.doctorId, event.patientId);
            }}
          >
            <svg
              fill="#FA5252"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="24px"
              height="24px"
            >
              {" "}
              <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
            </svg>
          </div>
        </div>
        <h3 className="pb-0 text-lg">
          {editing ? (
            <>
              {"Title: "}
              <input
                className="bg-white border-b-2 border-black"
                type="text"
                value={title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </>
          ) : (
            title.toUpperCase()
          )}
        </h3>
        <div className="font-bold pb-3">
          {event.patientName} - {event.doctorName}
        </div>
        <p>
          {editing ? (
            <>
              {"Start Time: "}
              <input
                className="bg-white border-b-2 border-black"
                type="datetime-local"
                value={startTime?.toISOString().slice(0, -1)}
                onChange={(e) =>
                  handleInputChange("start", new Date(e.target.value))
                }
              />
            </>
          ) : (
            formatDate(startTime)
          )}
          <span>&#8901;</span>
          {editing ? (
            <></>
          ) : (
            formatTimeRange(
              startTime,
              new Date(startTime.getTime() + 60 * 60 * 1000)
            )
          )}
        </p>
      </div>
    </div>
  );
}
