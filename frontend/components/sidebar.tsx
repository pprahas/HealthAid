"use client";
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import {
  ConvoListContext,
  CurrentConvoContext,
  SidebarContext,
  ConvoLoadingContext,
} from "@/app/(main)/layout";
import { PatientContext } from "@/app/(main)/layout";
import axios, { AxiosError } from "axios";
import { Conversation, Doctor, Message, Patient, PatientDefault } from "@/types";
import { DoctorDefault } from "@/types";
import { usePathname } from "next/navigation";

// interface props {
//     patients: Patient[];
// }

export function Sidebar() {
  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.Dispatch<React.SetStateAction<Patient>>
  ];
  const [doctorList, setDoctorList] = useState<Array<Doctor>>([]);
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

  async function getAllDoctors() {
    if (patient && patient.doctors != undefined) {
      try {
        console.log("Doctors:", patient.doctors);
        const doctorData = await Promise.all(patient.doctors.map(getDoctors));
        let gptDoctor: Doctor = {
          _id: "gpt",
          firstName: "Chat",
          lastName: "GPT",
          email: "chatgpt@openai.com",
          patients: Array(1).fill(PatientDefault)
        };
        doctorData.push(gptDoctor);
        setDoctorList(doctorData);
      } catch (error) {
        console.log(error);
      }
    } else {
      setDoctorList([]);
    }
  }

  const createNewConvo = async () => {
    setConvoLoading(true);
    try {
      const createConvoResponse = await axios.post(
        "http://localhost:8080/conversation/createConversation",
        {
          patientId: patient._id,
        }
      );
      const data = await createConvoResponse.data;
      console.log(data);
      let newGPTMessage: Message = {
        senderType: "gpt",
        date: new Date(),
        content: data.response.gptResponse.content,
      };
      let newConversation: Conversation = {
        _id: data.response.conversationId,
        title: "",
        date: new Date(),
        patient: "",
        messages: [newGPTMessage],
      };
      setConvoList([...convoList, newConversation]);
      setConvo(newConversation);
    } catch (error) {
      console.error("Error:", error);
    }
    setConvoLoading(false);
  };

  useEffect(() => {
    getAllDoctors();
  }, [patient]);

  return (
    <div className="flex flex-col content-center space-y-4 text-lg h-[calc(100vh-56px)] overflow-auto snap-y pr-4">
      <div
        className={`self-center text-center ${
          convoLoading ? "bg-secondary-400" : "bg-white"
        } font-bold py-4 w-[60%] rounded-3xl cursor-pointer`}
        onClick={() => {
          createNewConvo();
        }}
      >
        + New
      </div>
      {doctorList?.map((doctor, index: number) => (
        <div key={index} className="text-center snap-start">
          <div
            className={`${
              sidebarIndex == index
                ? "bg-white font-bold"
                : "cursor-pointer bg-secondary-400 hover:bg-secondary-200 transition duration-500"
            } py-4 rounded-tr-3xl rounded-br-3xl`}
            onClick={() => {
              setSidebarIndex(index);
            }}
          >
            <div>
              Dr. {doctor.firstName} {doctor.lastName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
