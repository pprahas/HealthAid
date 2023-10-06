"use client";
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/app/doctor/layout";
import { PatientContext } from "@/app/doctor/layout";
import axios, { AxiosError } from "axios";
import { Doctor, Patient, PatientDefault } from "@/types";
import { DoctorDefault } from "@/types";
import { usePathname } from "next/navigation";
import { DoctorContext } from "@/app/doctor/layout";

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
  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    React.Dispatch<React.SetStateAction<Doctor>>
  ];
  const [patientList, setPatientList] = useState<Array<Patient>>([]);
  const path = usePathname();

  const getPatients = async (patientId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getPatientFromId",
        {
          id: patientId,
        }
      );
      if (response.status == 400) {
        const data = await response.data;
        return data.patient;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function getAllPatients() {
    if (doctor.patients) {
      const patientData = await Promise.all(doctor.patients.map(getPatients));
      setPatientList(patientData);
    } else {
      setPatientList([]);
    }
  }

  useEffect(() => {
    console.log("Patients:", doctor.patients);
    console.log("id:", doctor._id);
    getAllPatients();
  }, [doctor]);

  return (
    <div className="content-center space-y-4 text-lg h-[calc(100vh-56px)] overflow-auto snap-y pr-4 ">
      {patientList?.map((patient, index: number) => (
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
            {patient && (
              <div>
                {patient.firstName} {patient.lastName}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
