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
import { Doctor, DoctorDefault, Conversation } from "@/types";
import { RightArrow } from "@/components/rightArrow";
import { ChatContainerDoctor } from "@/components/chatContainerDoctor";

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

  const updateConvo = (conversation: Conversation) => {
    setCurrentConvo(conversation);
  };

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
          {"Email: "}{patientList[sidebarIndex]?.email}<br />
        </h1>
      )}
      {patientList[sidebarIndex]?.bio && (
        <h1 className="text-2xl">
          {"Bio: "}{patientList[sidebarIndex]?.bio}
        </h1>
      )}
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
                <div>
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
      </div>
    </section>
  );
}
