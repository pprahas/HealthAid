"use client";
import "@/styles/globals.css";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "../../components/sidebar";
import { Patients } from "./home/testList";
import { useEffect, useState, createContext, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  Conversation,
  DefaultConversation,
  Doctor,
  Patient,
  PatientDefault,
} from "@/types";

type SidebarContextType = [
  number,
  React.Dispatch<React.SetStateAction<number>>
];
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);
type PatientContextType = [
  Patient,
  React.Dispatch<React.SetStateAction<Patient>>
];

export const PatientContext = createContext<PatientContextType | undefined>(
  undefined
);

type CurrentConvoContextType = [
  Conversation,
  React.Dispatch<React.SetStateAction<Conversation>>
];

export const CurrentConvoContext = createContext<
  CurrentConvoContextType | undefined
>(undefined);

type ConvoListContextType = [
  Conversation[],
  React.Dispatch<React.SetStateAction<Conversation[]>>
];
export const ConvoListContext = createContext<ConvoListContextType | undefined>(
  undefined
);

type DoctorListContextType = [
  Doctor[],
  React.Dispatch<React.SetStateAction<Doctor[]>>
];
export const DoctorListContext = createContext<
  DoctorListContextType | undefined
>(undefined);

type ConvoLoadingContextType = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
];
export const ConvoLoadingContext = createContext<
  ConvoLoadingContextType | undefined
>(undefined);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [patient, setPatient] = useState(PatientDefault);
  const [email, setEmail] = useState("safdl@garsd.com");
  const [currentConvo, setCurrentConvo] = useState(DefaultConversation);
  const [convoList, setConvoList] = useState<Conversation[]>([]);
  const [convoLoading, setConvoLoading] = useState(true);
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);

  useEffect(() => {
    getPatient();
  }, []);

  const getPatient = async () => {
    let localUserObjectString = localStorage.getItem("user") ?? "";
    if (localUserObjectString != "") {
      let localUserObject = JSON.parse(localUserObjectString);
      try {
        const response = await axios.post(
          "http://localhost:8080/getPatientByEmail",
          {
            email: localUserObject.email,
          }
        );

        const data = await response.data;
        setPatient(data.patient);
      } catch (error) {
        console.error("Error:", error);
      }
      setConvoLoading(false);
    }
  };

  return (
    <DoctorListContext.Provider value={[doctorList, setDoctorList]}>
      <ConvoLoadingContext.Provider value={[convoLoading, setConvoLoading]}>
        <ConvoListContext.Provider value={[convoList, setConvoList]}>
          <CurrentConvoContext.Provider value={[currentConvo, setCurrentConvo]}>
            <SidebarContext.Provider
              value={[activeTabIndex, setActiveTabIndex]}
            >
              <PatientContext.Provider value={[patient, setPatient]}>
                <div className="healthaid font-outfit min-h-screen flex flex-col bg-background">
                  <header className="last:sticky flex top-0 h-15 items-center">
                    <aside className="w-full md:w-60 top-0 h-14 flex justify-center items-center">
                      <div className="text-3xl font-bold">HealthAid</div>
                    </aside>
                    <Navbar />
                  </header>

                  <div className="flex flex-col md:flex-row flex-1">
                    <aside className="w-full md:w-60 pr-2 h-[calc(100vh-56px)]">
                      <Sidebar />
                    </aside>
                    <div className="flex-1 bg-white rounded-tl-3xl">
                      {children}
                    </div>
                  </div>
                </div>
              </PatientContext.Provider>
            </SidebarContext.Provider>
          </CurrentConvoContext.Provider>
        </ConvoListContext.Provider>
      </ConvoLoadingContext.Provider>
    </DoctorListContext.Provider>
  );
}
