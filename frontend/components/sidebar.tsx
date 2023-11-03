"use client";
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import {
  ConvoListContext,
  CurrentConvoContext,
  SidebarContext,
  ConvoLoadingContext,
  DoctorListContext,
} from "@/app/(main)/layout";
import { PatientContext } from "@/app/(main)/layout";
import axios, { AxiosError } from "axios";
import {
  Conversation,
  Doctor,
  Message,
  Patient,
  PatientDefault,
} from "@/types";
import { DoctorDefault } from "@/types";
import { usePathname } from "next/navigation";
import { waitUntilSymbol } from "next/dist/server/web/spec-extension/fetch-event";

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
  const [doctorList, setDoctorList] = useContext(DoctorListContext) as [
    Doctor[],
    React.Dispatch<React.SetStateAction<Doctor[]>>
  ];
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
        const allDoctorData: Doctor[] = [
          {
            _id: "gpt",
            firstName: "Chat",
            lastName: "GPT",
            email: "chatgpt@openai.com",
            patients: Array(1).fill(PatientDefault),
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

  const getGptConvos = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/conversation/getConversations",
        {
          patientId: patient._id,
          doctorId: "gpt",
        }
      );

      const data = await response.data;
      setConvoList(data);
      setConvoLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setConvo(convoList[convoList.length - 1]);
  }, [convoList]);

  const createNewConvo = async () => {
    setConvoLoading(true);
    setSidebarIndex(0);
    try {
      const createConvoResponse = await axios.post(
        "http://localhost:8080/conversation/createConversation",
        {
          patientId: patient._id,
        }
      );
      const data = await createConvoResponse.data;
      data;
      await getGptConvos();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteDoctor = async (doctorId: String) => {
    try {
      let doctorIndex = doctorList.findIndex((doctor) => {
        return doctor._id === doctorId;
      });
      if (doctorIndex != -1) {
        let currDoctorList = [...doctorList];
        currDoctorList.splice(doctorIndex, 1);
        setDoctorList(currDoctorList);
        setSidebarIndex(0);
        const updatePatientResponse = await axios.post(
          "http://localhost:8080/updatePatient",
          {
            patientId: patient._id,
            remove: {
              doctors: doctorId,
            },
          }
        );
        const data = await updatePatientResponse.data;
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        <div key={index} className="text-center snap-start relative group">
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

          {doctor.email != "chatgpt@openai.com" && (
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
              onClick={() => {
                deleteDoctor(doctor._id);
              }}
            >
              <svg
                className="h-6 w-6 bg-red color-red text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="#ff0000"
                fill="#ff0000"
              >
                <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
