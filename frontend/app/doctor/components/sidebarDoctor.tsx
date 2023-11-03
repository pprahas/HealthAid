"use client";
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { PatientListContext, SidebarContext } from "@/app/doctor/layout";
import { DoctorContext } from "@/app/doctor/layout";
import axios, { AxiosError } from "axios";
import { Patient } from "@/types";
import { Doctor } from "@/types";

export function Sidebar() {
  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];
  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    React.Dispatch<React.SetStateAction<Doctor>>
  ];
  const [patientList, setPatientList] = useContext(PatientListContext) as [
    Patient[],
    React.Dispatch<React.SetStateAction<Patient[]>>
  ];

  const getPatients = async (patientId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getPatientFromId",
        {
          id: patientId,
        }
      );

      const data = await response.data;
      return data.patient;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function getAllPatients() {
    const patientData = await Promise.all(doctor.patients.map(getPatients));
    setPatientList(patientData);
    setSidebarIndex(0);
  }

  useEffect(() => {
    getAllPatients();
  }, [doctor]);

  const deletePatient = async (patientId: String) => {
    try {
      let patientIndex = patientList.findIndex((patient) => {
        patient._id == patientId;
      });
      let currPatientList = [...patientList];
      currPatientList.splice(patientIndex, 1);
      setPatientList(currPatientList);
      setSidebarIndex(0);
      const updatePatientResponse = await axios.post(
        "http://localhost:8080/updatePatient",
        {
          patientId: patientId,
          remove: {
            doctors: doctor._id,
          },
        }
      );
      const data = await updatePatientResponse.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {patientList?.map(
        (patient, index: number) =>
          patient.activeAccount && (
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
                  {patient.firstName} {patient.lastName}
                </div>
              </div>

              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                onClick={() => {
                  deletePatient(patient._id);
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
            </div>
          )
      )}
    </div>
  );
}
