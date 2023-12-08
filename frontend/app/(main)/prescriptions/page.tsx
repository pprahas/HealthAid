"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";
import axios, { AxiosError } from "axios";
import { PatientContext } from "../layout";
import { Patient } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";
import { Prescription } from "@/types";
import { PrescriptionView } from "@/components/prescriptionView";





export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([])

  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.SetStateAction<Patient>
  ];

  var date = new Date()
  
  const getPrescriptions = async (id: string) => {
    try {
      const response = await axios.post("http://localhost:8080/prescription/get", {
        id: id,
      });
  
      const data = await response.data;
      console.log(data)
      setPrescriptions(data)
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getPrescriptions(patient._id)
  }, [patient]);

  return (
    <section className="flex h-[calc(100vh-60px)] place-content-center">
      <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden max-w-2xl space-y-4 ">
        <h1 className="font-bold text-4xl">My Prescriptions</h1>
        {prescriptions.map((prescription: Prescription, index: number) => (
            <PrescriptionView key={index} prescription={prescription} allowRefill/>
        ))}
          
      </div>
      
    </section>
  );
}
