"use client";
import "@/styles/globals.css";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebarDoctor"
import { useEffect, useState, createContext, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [patient, setPatient] = useState(PatientDefault);
  const [patientList, setPatientList] = useState([PatientDefault]);
  const [doctor, setDoctor] = useState(DoctorDefault);
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
    <PatientListContext.Provider value={[patientList, setPatientList]}>
      <DoctorContext.Provider value={[doctor, setDoctor]}>
        <SidebarContext.Provider value={[activeTabIndex, setActiveTabIndex]}>
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
                <div className="flex-1 bg-white rounded-tl-3xl">{children}</div>
              </div>
            </div>
        </SidebarContext.Provider>
      </DoctorContext.Provider>
    </PatientListContext.Provider>
  );
}
