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

  if (convoLoading) {
    return (
      <section
        className={`flex items-center justify-center h-[calc(100vh-60px)]`}
      >
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-[15vw] h-[15vw] mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <Button
                    size="lg"
                    color="success"
                    className="text-xl shadow-md"
                  >
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
}
