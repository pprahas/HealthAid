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
} from "@/app/(main)/layout";
import { SetStateAction, useContext, useState } from "react";
import { Patient } from "@/types";
import {
  Doctor,
  DoctorDefault,
  Conversation,
  DefaultConversation,
} from "@/types";
import { ConversationList } from "./conversation";
import { RightArrow } from "@/components/rightArrow";
import { Message } from "@/types";

export default function PatientHome() {
  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as any[];
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    SetStateAction<Patient>
  ];
  const [doctor, setDoctor] = useState(DoctorDefault);
  const [convoList, setConvoList] = useState<Conversation[]>([]);
  const [convo, setConvo] = useContext(CurrentConvoContext) as [
    Conversation,
    React.Dispatch<React.SetStateAction<Conversation>>
  ];
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getDoctorInfo = async () => {
    if (sidebarIndex == 0) {
      let gptDoctor: Doctor = {
        _id: "gpt",
        firstName: "Chat",
        lastName: "GPT",
        email: "chatgpt@openai.com",
      };
      setDoctor(gptDoctor);
    }
    if (patient && patient.doctors) {
      try {
        const response = await axios.post(
          "http://localhost:8080/getDoctorFromId",
          {
            id: doctor._id,
          }
        );

        const data = await response.data;
        setDoctor(data.doctor);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getConversations = async (patientId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/conversation/getConversations",
        {
          patientId: patient._id,
          doctorId: doctor._id,
        }
      );

      const data = await response.data;
      console.log(data);
      setConvoList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendMessage = async (message: string) => {
    setLoading(true);
    let date = new Date();
    let newMessage: Message = {
      senderType: "me",
      content: message,
      date: date,
    };
    setCurrentMessage("");
    let currentConvo = convo;
    currentConvo.messages.push(newMessage);
    setConvo(currentConvo);

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
      console.log(data);
      let newGPTMessage: Message = {
        senderType: data.senderType,
        content: data.content,
        date: new Date(),
      };
      let currentConvo = convo;
      currentConvo.messages.push(newGPTMessage);
      setConvo(currentConvo);
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
    setLoading(false);
  };

  const updateConvo = (conversation: Conversation) => {
    console.log(conversation);
    setConvo(conversation);
  };

  useEffect(() => {
    if (sidebarIndex != -1) {
      getDoctorInfo();
      getConversations(doctor._id);
    } else {
      setMessages([]);
    }
  }, [sidebarIndex, patient]);

  return (
    <section className={`flex items-start h-[calc(100vh-60px)]`}>
      <div className="flex-auto w-[40%] h-full pt-9 pl-10 pr-8 overflow-hidden">
        <h1 className="font-bold text-4xl">
          Dr. {doctor.firstName} {doctor.lastName}
        </h1>
        <div className="overflow-auto h-full my-3">
          <div className="grid grid-cols-2 gap-y-3 text-2xl">
            <div>
              <p className="font-bold">Clinic name</p>
              <p>Address</p>
              <p>City</p>
              <p>Zip Code</p>
            </div>
            <div className="flex flex-col items-end">
              <p>Phone number</p>
              <p>Website</p>
              <p className="my-3">
                <Button size="lg" color="success" className="text-xl shadow-md">
                  Book appointment
                </Button>
              </p>
            </div>
          </div>

          <h1 className="font-bold text-4xl pt-24">Your Conversations</h1>
          <div className="space-y-5 pt-5">
            {convoList?.map((conversation, index: number) => (
              <div
                key={index}
                className={`${
                  convo == conversation
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
                <div>
                  <RightArrow />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-auto w-[60%] h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
        <div className="font-bold h-16 text-4xl pr-10">
          {convo.title} id:{convo._id}:
        </div>
        <div className="flex-grow overflow-y-auto snap-y">
          <ChatContainer messages={convo.messages} />
        </div>
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
      </div>
    </section>
  );
}
