"use client";
import "@/styles/globals.css";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebarDoctor";
import { useEffect, useState, createContext, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  Conversation,
  DefaultConversation,
  Doctor,
  DoctorDefault,
  Patient,
  PatientDefault,
  UserDefualt,
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

type DoctorContextType = [Doctor, React.Dispatch<React.SetStateAction<Doctor>>];

export const DoctorContext = createContext<DoctorContextType | undefined>(
  undefined
);

type PatientListContextType = [
  Patient[],
  React.Dispatch<React.SetStateAction<Patient[]>>
];
export const PatientListContext = createContext<
  PatientListContextType | undefined
>(undefined);

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [patient, setPatient] = useState(PatientDefault);
  const [patientList, setPatientList] = useState<Array<Patient>>([]);
  const [doctor, setDoctor] = useState(DoctorDefault);
  const [convoList, setConvoList] = useState<Array<Conversation>>([]);
  const [currentConvo, setCurrentConvo] = useState(DefaultConversation);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getDoctor();
  }, []);

  const getDoctor = async () => {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    console.log("user id:", userObject._id);
    try {
      const response = await axios.post(
        "http://localhost:8080/getDoctorFromId",
        {
          id: `${userObject._id}`,
        }
      );

      const data = await response.data;
      console.log("data:", data);
      setDoctor(data.doctor);
      //console.log(data.patient)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <CurrentConvoContext.Provider value={[currentConvo, setCurrentConvo]}>
      <ConvoListContext.Provider value={[convoList, setConvoList]}>
        <PatientListContext.Provider value={[patientList, setPatientList]}>
          <DoctorContext.Provider value={[doctor, setDoctor]}>
            <SidebarContext.Provider
              value={[activeTabIndex, setActiveTabIndex]}
            >
              <PatientContext.Provider value={[patient, setPatient]}>
                <div className="healthaid font-outfit min-h-screen flex flex-col bg-background">
                  <header className="last:sticky flex top-0 h-15 items-center">
                    <aside className="w-full md:w-60 top-0 h-14 flex justify-center items-center">
                      <div
                        onClick={() => {
                          window.location.href = "/doctor/home";
                        }}
                        className="cursor-pointer text-3xl font-bold"
                      >
                        HealthAid
                      </div>
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
          </DoctorContext.Provider>
        </PatientListContext.Provider>
      </ConvoListContext.Provider>
    </CurrentConvoContext.Provider>
  );
}
