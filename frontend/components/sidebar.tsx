'use client'
//import { Patient } from "../app/(main)/home/testList";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/app/(main)/layout";
import { PatientContext } from "@/app/(main)/layout";
import axios, { AxiosError } from "axios";
import { Patient } from "@/types";
import { DoctorDefault } from "@/types";

// interface props {
//     patients: Patient[];
// }



export function Sidebar () {
    const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [number, React.Dispatch<React.SetStateAction<number>>];
    const [patient, setPatient] = useContext(PatientContext) as [Patient, React.Dispatch<React.SetStateAction<Patient>>]
    const [doctorList, setDoctorList] = useState([DoctorDefault])
    
    const getDoctors = async (doctorId : string) => {
		try {
			const response = await axios.post('http://localhost:8080/getDoctorFromId', {
				id: doctorId
			});
	
			const data = await response.data;
            return data.doctor
		} catch (error) {
			console.error('Error:', error);
		}
	};

    async function getAllDoctors() {
        const doctorData = await Promise.all(patient.doctors.map(getDoctors))
        setDoctorList(doctorData)
    }

    useEffect(() => {
        getAllDoctors();
        //console.log(doctorList)
    }, [patient])

    return (
        <div className="content-center space-y-4 text-lg h-[calc(100vh-56px)] overflow-auto snap-y pr-4">
            {doctorList?.map((doctor, index : number) => (
                <div key={index} className="text-center snap-start">
                    <div className={`${sidebarIndex == index ? 'bg-white font-bold' : 'cursor-pointer bg-secondary-400 hover:bg-secondary-200 transition duration-500'} py-4 rounded-tr-3xl rounded-br-3xl`} onClick={() => {
                        setSidebarIndex(index)
                    }}>
                        <div>
                            Dr. {doctor.firstName} {doctor.lastName}
                        </div>
                    </div>
                    
                </div>
            ))}
            
        </div>
    );
};