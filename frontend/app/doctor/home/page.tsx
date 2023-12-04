"use client";
import React, { useEffect } from "react";
import { messages } from "./testConvo";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import {
  ConvoListContext,
  CurrentConvoContext,
  DoctorContext,
  PatientContext,
  PatientListContext,
  SidebarContext,
} from "@/app/doctor/layout";
import { SetStateAction, useContext, useState } from "react";
import { DefaultConversation, Patient, PatientDefault } from "@/types";
import { Doctor, DoctorDefault, Conversation, Message } from "@/types";
import { RightArrow } from "@/components/rightArrow";
import { ChatContainerDoctor } from "@/components/chatContainerDoctor";
import { UnreadIcon } from "@/components/unreadIcon";

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

  useEffect(() => {}, []);

  const getConversations = async (patientId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/conversation/getConversations",
        {
          patientId: patientId,
          doctorId: doctor._id,
        }
      );

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

  const handleInputChange = (field: string, value: string | Date) => {
    if (field == "title" && typeof value == "string") {
      setApptTitle(value);
    }
    if (field == "start" && value instanceof Date) {
      setApptDate(value);
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
          <div className="flex flex-col items-start">
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
        </div>
        <div className="space-y-5 pt-5">
          {currentConvo &&
            convoList?.map((conversation, index: number) => (
              <div
                key={index}
                className={`${
                  currentConvo._id == conversation._id
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
                  placeholder="Tell ChatGPT about your symptoms"
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
