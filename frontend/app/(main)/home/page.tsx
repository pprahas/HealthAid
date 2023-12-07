"use client";
import React, { useEffect } from "react";
import { ChatContainer } from "../../../components/chatContainer";
import { messages as testMessages } from "./testConvo";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import {
  SidebarContext,
  PatientContext,
  CurrentConvoContext,
  ConvoListContext,
  ConvoLoadingContext,
  DoctorListContext,
} from "@/app/(main)/layout";
import { SetStateAction, useContext, useState } from "react";
import { Clinic, Patient, PatientDefault } from "@/types";
import {
  Doctor,
  DoctorDefault,
  Conversation,
  DefaultConversation,
} from "@/types";
import { ConversationList } from "./conversation";
import { RightArrow } from "@/components/rightArrow";
import { Message } from "@/types";
import { Spinner } from "@nextui-org/spinner";
import { after } from "node:test";
import { UnreadIcon } from "@/components/unreadIcon";
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

export default function PatientHome() {
  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as any[];
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.Dispatch<React.SetStateAction<Patient>>
  ];
  const [doctor, setDoctor] = useState(DoctorDefault);
  const [convo, setConvo] = useContext(CurrentConvoContext) as [
    Conversation,
    React.Dispatch<React.SetStateAction<Conversation>>
  ];
  const [convoList, setConvoList] = useContext(ConvoListContext) as [
    Array<Conversation>,
    React.Dispatch<React.SetStateAction<Array<Conversation>>>
  ];
  const [convoLoading, setConvoLoading] = useContext(ConvoLoadingContext) as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ];
  const [doctorList, setDoctorList] = useContext(DoctorListContext) as [
    Doctor[],
    React.Dispatch<React.SetStateAction<Doctor[]>>
  ];
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clinic, setClinic] = useState<Clinic>();
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [apptTitle, setApptTitle] = useState("");
  const [apptDate, setApptDate] = useState(new Date());
  const [allDoctors, setAllDoctors] = useState([] as Doctor[]);
  const [doctorEvents, setDoctorEvents] = useState<[EventProps]>([{}]);
  const [patientEvents, setPatientEvents] = useState<[EventProps]>([{}]);
  const [apptError, setApptError] = useState("");
  const [saveApptEnabled, setSaveApptEnabled] = useState(false);
  const [typing, setTyping] = useState(false);

  const getDoctorInfo = async () => {
    if (sidebarIndex == 0) {
      let gptDoctor: Doctor = {
        _id: "gpt",
        firstName: "Chat",
        lastName: "GPT",
        email: "chatgpt@openai.com",
        patients: Array(1).fill(PatientDefault),
        activeAccount: true,
      };
      setDoctor(gptDoctor);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/getDoctorFromId",
          {
            id: doctorList[sidebarIndex],
          }
        );

        const data = await response.data;
        setDoctor(data.doctor);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getConversations = async (doctorId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/conversation/getConversations",
        {
          patientId: patient._id,
          doctorId: doctorId,
        }
      );

      const data = await response.data;
      console.log(data);
      setConvoList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function getAllDoctors() {
    if (patient && patient.doctors != undefined) {
      try {
        const allDoctorData: Doctor[] = [
          {
            _id: "gpt",
            firstName: "Chat",
            lastName: "GPT",
            email: "chatgpt@openai.com",
            patients: Array(1).fill(PatientDefault),
            activeAccount: true,
          },
        ];
        const doctorDataDatabase = await Promise.all(
          patient.doctors.map(getDoctors)
        );
        allDoctorData.push(...doctorDataDatabase);
        setDoctorList(allDoctorData);
      } catch (error) {}
    } else {
      setDoctorList([]);
    }
  }

  const getDoctors = async (doctorId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getDoctorFromId",
        {
          id: doctorId,
        }
      );

      const data = await response.data;
      return data.doctor;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getDoctorsInNetwork();
  }, [patient]);

  const getDoctorsInNetwork = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getDoctorFromId/all",
        {}
      );

      const data = await response.data;

      filterByInsurance(data);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };

  const doctorInsurance = async (id: string) => {
    try {
      const response = await axios.post("http://localhost:8080/getClinic", {
        clinicId: id,
      });

      const data = await response.data;
      return data.clinic.network;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterByInsurance = async (doctorList: Doctor[]) => {
    let newDoctorList = [] as Doctor[];

    const defaultDoctor = {
      _id: "Automatically Choose",
      firstName: "Automatically",
      lastName: "Choose",
      patients: [],
      email: "Automatically Choose",
      activeAccount: false,
    };
    newDoctorList.push(defaultDoctor);

    for (let i = 0; i < doctorList.length; i++) {
      if (doctorList[i].clinic != undefined) {
        let insurance = await doctorInsurance(doctorList[i].clinic as string);
        if (insurance === undefined) continue;
        if (insurance.includes(patient.insurance, 0)) {
          console.log(`adding ${doctorList[i].firstName} to list`);
          doctorList[i].firstName = "Dr. " + doctorList[i].firstName;
          newDoctorList.push(doctorList[i]);
        }
      }
    }

    setAllDoctors(newDoctorList);
  };

  async function handleSendToDoctor() {
    console.log("doctors", allDoctors);
    console.log("first doc", allDoctors[1]);
    try {
      const updateDiagnosisResponse = await axios.post(
        "http://localhost:8080/updateDiagnosis",
        {
          diagnosis: "pending",
          conversationId: convo._id,
          doctorEmail: allDoctors[1].email,
        }
      );
      convo.diagnosis = "pending";
      await getAllDoctors();
      const data = (await updateDiagnosisResponse.data) as string;
      let currPatient = Object.assign({}, patient) as Patient;

      const updateDoctorsResponse = await axios.post(
        "http://localhost:8080/updatePatient",
        {
          patientId: patient._id,
          add: {
            doctors: `${data}`,
          },
        }
      );
      window.alert("Initial Diagnosis has been sent!");
      let docIndex = doctorList.findIndex((doctor) => {
        doctor._id == data;
      });
      if (currPatient.doctors && docIndex != -1) {
        currPatient.doctors.push(`${data}`);
      } else if (docIndex != -1) {
        currPatient.doctors = [`${data}`];
      }
      setPatient(currPatient);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleConvoUpdate(lastMessage: string) {
    if (lastMessage.toLowerCase().includes("diagnosis: ")) {
      if (convo.diagnosis == "none") {
        console.log("auto send to doctor");
        if (doctorList.length > 0) {
          const send = async () => {
            convo.diagnosis = "pending";
            await handleSendToDoctor();
          };
          await send();
        }
      }
    }
  }

  const sendMessage = async (message: string) => {
    console.log(convo.diagnosis);
    if (
      convo.diagnosis == "approved" ||
      convo.diagnosis == "denied" ||
      convo.diagnosis == "pending"
    ) {
      let date = new Date();
      let newMessage: Message = {
        id: "",
        senderType: "me",
        content: message,
        date: date,
        seen: false,
      };
      setCurrentMessage("");
      let currentConvo = convo;
      currentConvo.messages.push(newMessage);
      setConvo(currentConvo);
      try {
        await axios.post("http://localhost:8080/conversation/sendMessagePat", {
          patientId: patient._id,
          conversationId: convo._id,
          newMessage: message,
        });
      } catch {}
      return;
    }

    setLoading(true);
    let date = new Date();
    let newMessage: Message = {
      id: "",
      senderType: "me",
      content: message,
      date: date,
      seen: false,
    };
    setCurrentMessage("");
    let currentConvo = convo;
    currentConvo.messages.push(newMessage);
    setConvo(currentConvo);
    setTyping(true);

    // Make api call
    try {
      const sendMessageResponse = await axios.post(
        "http://localhost:8080/conversation/sendMessage",
        {
          patientId: patient._id,
          conversationId: convo._id,
          newMessage: message,
        }
      );
      const data = await sendMessageResponse.data;

      let newGPTMessage: Message = {
        id: "",
        senderType: data.senderType,
        content: data.content,
        date: new Date(),
        seen: false,
      };
      await handleConvoUpdate(data.content);
      let currentConvo = convo;
      currentConvo.messages.push(newGPTMessage);
      setConvo(currentConvo);
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    } finally {
      setTyping(false);
    }
    setLoading(false);
  };

  const updateConvo = (conversation: Conversation) => {
    let currMessages = conversation.messages;
    for (let i = 0; i < currMessages.length; i++) {
      let message = currMessages[i];
      if (message.senderType == "doctor") {
        if (message.seen == undefined || !message.seen) {
          message.seen = true;
        }
      }
    }
    conversation.messages = currMessages;
    setConvo(conversation);
  };

  const getClinicInformation = async (clinicId?: string) => {
    try {
      const response = await axios.post("http://localhost:8080/getClinic", {
        clinicId: clinicId,
      });

      const data = await response.data;
      setClinic(data.clinic);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getConversations(doctor._id);
    if (doctor._id != "gpt") {
      getClinicInformation(doctor.clinic);
    }
    getDoctorAppts();
    getPatientAppts();
  }, [doctor]);

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

  useEffect(() => {
    setConvo(DefaultConversation);
    getDoctorInfo();
  }, [sidebarIndex, patient]);

  const handleInputChange = (field: string, value: string | Date) => {
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
      } else {
        setApptError("The patient is not avaiable during this time");
        setApptDate(value);
        setSaveApptEnabled(apptTitle != "");
      }
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

  function toLocalISOString(date: Date) {
    const off = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - off * 60 * 1000);
    return adjustedDate.toISOString().slice(0, -1);
  }

  if (convoLoading) {
    return (
      <section
        className={`flex items-center justify-center h-[calc(100vh-60px)]`}
      >
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-[15vw] h-[15vw] mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  } else {
    return (
      <section className={`flex items-start h-[calc(100vh-60px)]`}>
        <div className="flex-auto w-[40%] h-full pt-9 pl-10 pr-8 overflow-scroll">
          <h1
            className={`${
              sidebarIndex == 0 ? "hidden" : ""
            } font-bold text-4xl`}
          >
            Dr. {doctor.firstName} {doctor.lastName}
          </h1>
          <div className="overflow-auto h-full my-3">
            <div
              className={`${
                sidebarIndex == 0 ? "hidden" : ""
              } grid grid-cols-2 gap-y-3 text-2xl`}
            >
              <div>
                <p className="font-bold">{clinic?.name}</p>
                <p>{clinic?.address}</p>
                <p>{clinic?.postalCode}</p>
              </div>
              <div className="flex flex-col items-end">
                <p>{clinic?.phoneNumber}</p>
                <p>{clinic?.website}</p>
                <p className="my-3">
                  <Button
                    size="lg"
                    color="success"
                    className="text-xl shadow-md"
                    isDisabled={creatingAppointment}
                    onClick={(e) => {
                      setCreatingAppointment(true);
                    }}
                  >
                    Schedule Appointment
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
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
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
                      isDisabled={!saveApptEnabled}
                      onClick={(e) => {
                        if (creatingAppointment) {
                          createAppointment(
                            doctor._id,
                            patient._id,
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
            </div>

            <h1
              className={`font-bold text-4xl ${
                sidebarIndex == 0 ? "" : "pt-24"
              }`}
            >
              Your Conversations
            </h1>
            <div className="space-y-5 pt-5">
              {convo &&
                convoList?.map((conversation, index: number) => (
                  <div
                    key={index}
                    className={`${
                      convo._id == conversation._id
                        ? "bg-background font-bold"
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
                        return message.senderType == "doctor" && !message.seen;
                      }).length > 0 && <UnreadIcon />}
                      <RightArrow />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex-auto w-[60%] h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto snap-y">
            {convo && (
              <ChatContainer messages={convo.messages} typing={typing} />
            )}
          </div>
          {convo && (
            <div className="h-min my-1 place-items-center">
              <div className="flex flex-col text-[#ff0000] font-bold">
                {error && <div>An error occurred while sending a message</div>}
                <div className="flex space-x-1 pr-10 text-black">
                  <Textarea
                    disabled={loading}
                    maxRows={2}
                    placeholder={
                      (convo && convo.diagnosis == "approved") ||
                      convo.diagnosis == "denied"
                        ? "Talk to your doctor"
                        : "Tell ChatGPT about your symptoms"
                    }
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
}
