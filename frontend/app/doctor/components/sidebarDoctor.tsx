'use client'
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/app/doctor/layout";
import { DoctorContext } from "@/app/doctor/layout";
import axios, { AxiosError } from "axios";
import { Patient } from "@/types";
import { Doctor } from "@/types";


export function Sidebar () {
    const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [number, React.Dispatch<React.SetStateAction<number>>];
    const [doctor, setDoctor] = useContext(DoctorContext) as [Doctor, React.Dispatch<React.SetStateAction<Doctor>>]
    const [patientList, setPatientList] = useState<Array<Patient>>([]);

    
    const getPatients = async (patientId : string) => {
		try {
			const response = await axios.post('http://localhost:8080/getPatientFromId', {
				id: patientId
			});
	
			const data = await response.data;
            return data.patient
		} catch (error) {
			console.error('Error:', error);
		}
	};

    async function getAllPatients() {
        const patientData = await Promise.all(doctor.patients.map(getPatients))
        setPatientList(patientData)
    }

    useEffect(() => {
        getAllPatients();
        console.log(patientList)
        
    }, [doctor])

    return (
        <div className="content-center space-y-4 text-lg h-[calc(100vh-56px)] overflow-auto snap-y pr-4">
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
                        <div>
                        {patient.firstName} {patient.lastName}
                        </div>
                    </div>
                </div>
            ))}
            
        </div>
    );
};