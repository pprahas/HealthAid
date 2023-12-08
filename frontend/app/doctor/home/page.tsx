"use client";
import React, { useEffect } from "react";
import { messages } from "./testConvo";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import {
  AllPrescriptionsContext,
  ConvoListContext,
  CurrentConvoContext,
  DoctorContext,
  PatientContext,
  PatientListContext,
  SidebarContext,
} from "@/app/doctor/layout";
import { SetStateAction, useContext, useState } from "react";
import {
  DefaultConversation,
  Patient,
  PatientDefault,
  Prescription,
} from "@/types";
import { Doctor, DoctorDefault, Conversation, Message } from "@/types";
import { RightArrow } from "@/components/rightArrow";
import { ChatContainerDoctor } from "@/components/chatContainerDoctor";
import { UnreadIcon } from "@/components/unreadIcon";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { PatientPerscriptionView } from "@/components/patientPerscriptions";
import { TypingIndicator } from "@/components/typingIndicator";

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

export default function DoctorHome() {
  const [patientList, setPatientList] = useContext(PatientListContext) as [
    Patient[],
    React.Dispatch<React.SetStateAction<Patient[]>>
  ];

  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];

  const [convoList, setConvoList] = useContext(ConvoListContext) as [
    Array<Conversation>,
    React.Dispatch<React.SetStateAction<Array<Conversation>>>
  ];

  const [currentConvo, setCurrentConvo] = useContext(CurrentConvoContext) as [
    Conversation,
    React.Dispatch<React.SetStateAction<Conversation>>
  ];

  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    SetStateAction<Patient>
  ];

  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    SetStateAction<Doctor>
  ];

  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [apptTitle, setApptTitle] = useState("");
  const [apptDate, setApptDate] = useState(new Date());
  const [patientEvents, setPatientEvents] = useState<[EventProps]>([{}]);
  const [doctorEvents, setDoctorEvents] = useState<[EventProps]>([{}]);
  const [apptError, setApptError] = useState("");
  const [saveApptEnabled, setSaveApptEnabled] = useState(false);
  const [writingPrescription, setWritingPrescription] = useState(false);
  const [prescriptionName, setPrescriptionName] = useState("");
  const [prescriptionSchedule, setPrescriptionSchedule] = useState("");
  const [prescriptionRefills, setPrescriptionRefills] = useState(0);

  const allPrescriptionSchedules: [string] = [
    "Twice a day",
    "Daily",
    "Weekly",
    "Bi-Weekly",
    "Monthly",
  ];

  useEffect(() => {}, []);

  const getPrescriptions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/prescription/get",
        {
          id: doctor._id,
        }
      );
      const data = await response.data;
      let currDoc = doctor;
      currDoc.prescriptions = data;
      setDoctor(currDoc);
      console.log("prescriptions: ", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (doctor._id != "") {
      console.log(`getting perscriptions for ${doctor._id}`);
      getPrescriptions();
    }
  }, [doctor._id]);

  const getConversations = async (patientId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/conversation/getConversations",
        {
          patientId: patientId,
          doctorId: doctor._id,
        }
      );
      getDoctorAppts();
      getPatientAppts();
      const data = await response.data;
      setConvoList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {}, [currentConvo]);

  const sendMessage = async (message: string) => {
    setLoading(true);
    let date = new Date();
    let newMessage: Message = {
      id: "",
      senderType: "doctor",
      content: message,
      date: date,
      seen: false,
    };
    setCurrentMessage("");
    let convo = currentConvo;
    convo.messages.push(newMessage);
    setCurrentConvo(convo);

    // Make api call
    try {
      const sendMessageResponse = await axios.post(
        "http://localhost:8080/conversation/sendMessageDoc",
        {
          doctorId: doctor._id,
          conversationId: currentConvo._id,
          newMessage: message,
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
    setLoading(false);
  };

  const updateConvo = (conversation: Conversation) => {
    let currMessages = conversation.messages;
    for (let i = 0; i < currMessages.length; i++) {
      let message = currMessages[i];
      if (message.senderType == "me") {
        if (message.seen == undefined || !message.seen) {
          message.seen = true;
        }
      }
    }
    conversation.messages = currMessages;
    setCurrentConvo(conversation);
  };

  const handleInputChange = (field: string, value: string | Date | Number) => {
    console.log(`${field}: ${value}`);
    if (field == "prescriptionName" && typeof value == "string") {
      setPrescriptionName(value);
    }
    if (field == "prescriptionRefills" && typeof value == "number") {
      setPrescriptionRefills(value);
    }
    if (field == "title" && typeof value == "string") {
      setSaveApptEnabled(value != "");
      setApptTitle(value);
    }
    if (field == "start" && value instanceof Date) {
      let newValueEnd = new Date(value);
      newValueEnd.setHours(newValueEnd.getHours() + 1);

      // Find all overlapping events
      let patientOverlappingEvents = patientEvents.filter((event) => {
        if (event && event.start && event.end) {
          let eventStart = new Date(event.start);
          let eventEnd = new Date(event.end);
          let startsDuringAnotherEvent =
            eventStart <= value && eventEnd > value;
          let endsDuringAnotherEvent =
            eventStart < newValueEnd && eventEnd >= newValueEnd;
          let overlapsAnotherEvent =
            eventStart >= value && eventEnd <= newValueEnd;

          return (
            startsDuringAnotherEvent ||
            endsDuringAnotherEvent ||
            overlapsAnotherEvent
          );
        }
        return false;
      });

      let doctorOverlappingEvents = doctorEvents.filter((event) => {
        if (event && event.start && event.end) {
          let eventStart = new Date(event.start);
          let eventEnd = new Date(event.end);
          let startsDuringAnotherEvent =
            eventStart <= value && eventEnd > value;
          let endsDuringAnotherEvent =
            eventStart < newValueEnd && eventEnd >= newValueEnd;
          let overlapsAnotherEvent =
            eventStart >= value && eventEnd <= newValueEnd;

          return (
            startsDuringAnotherEvent ||
            endsDuringAnotherEvent ||
            overlapsAnotherEvent
          );
        }
        return false;
      });

      if (patientOverlappingEvents.length > 0) {
        setApptError("You already have an appointment during this time");
        setApptDate(value);
        setSaveApptEnabled(false);
      } else if (doctorOverlappingEvents.length > 0) {
        setApptError("You already have an appointment during this time");
        setApptDate(value);
        setSaveApptEnabled(false);
      } else {
        setApptError("");
        setApptDate(value);
        setSaveApptEnabled(apptTitle != "");
      }
    }
  };

  const getDoctorAppts = async () => {
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
          let newEvents: [EventProps] = [{}];
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
          console.log(newEvents);
          setDoctorEvents(newEvents);
        } else {
        }
      } catch (error) {}
    }
  };

  const getPatientAppts = async () => {
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
          let newEvents: [EventProps] = [{}];
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
          console.log(newEvents);
          setPatientEvents(newEvents);
        } else {
        }
      } catch (error) {}
    }
  };

  async function createAppointment(
    doctorId: string,
    patientId: string,
    time: Date,
    title: string
  ) {
    try {
      const response = await axios.post(
        "http://localhost:8080/appointment/create",
        {
          doctorId: doctorId,
          patientId: patientId,
          time: time,
          title: title,
        }
      );

      const data = await response.data;
    } catch (error) {
    } finally {
      setApptTitle("");
      setApptDate(new Date());
    }
  }

  async function createPrescription(
    doctorId: string,
    patientId: string,
    name: string,
    remainingRefills: number,
    cycle: string
  ) {
    try {
      const response = await axios.post(
        "http://localhost:8080/prescription/create",
        {
          patientId: patientId,
          doctorId: doctorId,
          date: new Date(),
          reminderCycle: cycle,
          name: name,
          remainingRefills: remainingRefills,
        }
      );
      await getPrescriptions();
    } catch (error) {
    } finally {
      setPrescriptionName("");
      setPrescriptionRefills(0);
      setPrescriptionSchedule("");
    }
  }

  function toLocalISOString(date: Date) {
    try {
      const off = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - off * 60 * 1000);
      return adjustedDate.toISOString().slice(0, -1);
    } catch {
      return new Date();
    }
  }

  useEffect(() => {
    if (patient._id == "" && patientList[sidebarIndex]) {
      getConversations(patientList[sidebarIndex]._id);
    } else {
      getConversations(patient._id);
    }
    setCurrentConvo(DefaultConversation);
  }, [patient, patientList, sidebarIndex]);

  return (
    <section className="columns-2 items-start h-[calc(100vh-60px)]">
      <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden">
        <h1 className="font-bold text-4xl">
          {patientList[sidebarIndex]?.firstName}{" "}
          {patientList[sidebarIndex]?.lastName}
          <br />
        </h1>
        {patientList[sidebarIndex]?.email && (
          <h1 className="text-2xl">
            {"Email: "}
            {patientList[sidebarIndex]?.email}
            <br />
          </h1>
        )}
        {patientList[sidebarIndex]?.bio && (
          <h1 className="text-2xl">
            {"Bio: "}
            {patientList[sidebarIndex]?.bio}
          </h1>
        )}
        <div className={`grid grid-cols-1 gap-y-3 text-2xl`}>
          <div className="flex space-x-5 items-start">
            <p className="my-3">
              <Button
                size="lg"
                color="success"
                className="text-xl shadow-md"
                isDisabled={creatingAppointment}
                onClick={(e) => {
                  setWritingPrescription(false);
                  setCreatingAppointment(true);
                }}
              >
                Schedule Appointment
              </Button>
            </p>
            <p className="my-3">
              <Button
                size="lg"
                color="success"
                className="text-xl shadow-md"
                isDisabled={creatingAppointment}
                onClick={(e) => {
                  setCreatingAppointment(false);
                  setWritingPrescription(true);
                }}
              >
                Write Prescription
              </Button>
            </p>
          </div>
          {creatingAppointment && (
            <div className="flex flex-col w-[100vw] space-y-[1vw] overflow-visible text-[1vw]">
              <div className="flex space-x-2">
                <div>{"Title: "}</div>
                <input
                  className="bg-white border-b-[0.1vw] border-black"
                  type="text"
                  value={apptTitle}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <div>{"Start Time: "}</div>
                <input
                  className="bg-white border-b-[0.1vw] border-black"
                  type="datetime-local"
                  value={apptDate ? toLocalISOString(apptDate) : ""}
                  onChange={(e) =>
                    handleInputChange("start", new Date(e.target.value))
                  }
                />
              </div>
              {apptError != "" && (
                <div className="text-red-600">{apptError}</div>
              )}
              <div className="w-full">
                <Button
                  size="lg"
                  color="success"
                  className="text-xl shadow-md"
                  isDisabled={apptTitle == ""}
                  onClick={(e) => {
                    if (creatingAppointment) {
                      createAppointment(
                        doctor._id,
                        patientList[sidebarIndex]?._id,
                        apptDate,
                        apptTitle
                      );
                    }
                    setCreatingAppointment(false);
                  }}
                >
                  Save Appointment
                </Button>
              </div>
            </div>
          )}
          {writingPrescription && (
            <div className="flex flex-col w-[100vw] space-y-[1vw] overflow-visible text-[1vw]">
              <div className="flex space-x-2">
                <div>{"Name: "}</div>
                <input
                  className="bg-white border-b-[0.1vw] border-black"
                  type="text"
                  value={prescriptionName}
                  onChange={(e) =>
                    handleInputChange("prescriptionName", e.target.value)
                  }
                />
              </div>
              <div className="flex space-x-2">
                <div>{"# of refills: "}</div>
                <input
                  className="bg-white border-b-[0.1vw] border-black"
                  type="number"
                  value={prescriptionRefills}
                  onChange={(e) => {
                    console.log(e.target.value);
                    handleInputChange(
                      "prescriptionRefills",
                      Number(e.target.value)
                    );
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  Schedule:
                  <Dropdown
                    classNames={{
                      base: "bg-white",
                    }}
                  >
                    <DropdownTrigger>
                      <Button
                        radius="lg"
                        color="primary"
                        variant="flat"
                        className="ml-2 text-md"
                      >
                        {prescriptionSchedule || "Select Schedule"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Prescription Schedule"
                      variant="light"
                      color="primary"
                      disallowEmptySelection
                      selectionMode="single"
                      onAction={(key) => {
                        setPrescriptionSchedule(key);
                      }}
                    >
                      {allPrescriptionSchedules.map((schedule) => (
                        <DropdownItem key={schedule}>{schedule}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              {apptError != "" && (
                <div className="text-red-600">{apptError}</div>
              )}
              <div className="w-full">
                <Button
                  size="lg"
                  color="success"
                  className="text-xl shadow-md"
                  isDisabled={
                    prescriptionName == "" ||
                    prescriptionRefills == 0 ||
                    prescriptionSchedule == ""
                  }
                  onClick={(e) => {
                    if (writingPrescription) {
                      createPrescription(
                        doctor._id,
                        patientList[sidebarIndex]?._id,
                        prescriptionName,
                        prescriptionRefills,
                        prescriptionSchedule
                      );
                    }
                    setWritingPrescription(false);
                  }}
                >
                  Send Prescription
                </Button>
              </div>
            </div>
          )}
        </div>
        <PatientPerscriptionView prescriptions={doctor.prescriptions} />
        <div className="space-y-5 pt-5">
          {currentConvo &&
            convoList?.map((conversation, index: number) => (
              <div
                key={index}
                className={`${
                  currentConvo._id == conversation._id
                    ? "bg-docBackground font-bold"
                    : "cursor-pointer bg-slate-200 hover:bg-secondary-300 transition duration-500"
                } text-xl shadow-md rounded-3xl p-2 pr-3 pl-5 flex items-center justify-between`}
                onClick={() => {
                  updateConvo(conversation);
                }}
              >
                <div>
                  {conversation.title
                    ? conversation.title
                    : `Conversation ${index + 1}`}
                </div>
                <div className="flex">
                  {conversation.messages.filter((message) => {
                    return message.senderType == "me" && !message.seen;
                  }).length > 0 && <UnreadIcon />}
                  <RightArrow />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto snap-y">
          {currentConvo && (
            <ChatContainerDoctor messages={currentConvo.messages} />
          )}
        </div>
        {(currentConvo.diagnosis == "denied" ||
          currentConvo.diagnosis == "approved") && (
          <div className="h-min my-1 place-items-center">
            <div className="flex flex-col text-[#ff0000] font-bold">
              {error && <div>An error occurred while sending a message</div>}
              <div className="flex space-x-1 pr-10 text-black">
                <Textarea
                  disabled={loading}
                  maxRows={2}
                  placeholder="Talk to your patient"
                  size="lg"
                  value={currentMessage}
                  onValueChange={(value) => {
                    setError(false);
                    setCurrentMessage(value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(currentMessage);
                    }
                  }}
                />
                <Button color="success" className="h-16 my-1.5 shadow-md">
                  <div
                    onClick={() => {
                      sendMessage(currentMessage);
                    }}
                    className="font-bold"
                  >
                    Send
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
