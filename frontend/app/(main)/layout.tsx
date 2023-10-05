'use client'
import "@/styles/globals.css";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "../../components/sidebar"
import { Patients } from "./home/testList";
import { useEffect, useState, createContext, useContext } from "react";
import axios, { AxiosError } from "axios";
import { Patient, PatientDefault } from "@/types";

type SidebarContextType = [number, React.Dispatch<React.SetStateAction<number>>];
export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
type PatientContextType = [Patient, React.Dispatch<React.SetStateAction<Patient>>];
export const PatientContext = createContext<PatientContextType | undefined>(undefined);


export default function Layout({children}: { children: React.ReactNode }) {
	const [activeTabIndex, setActiveTabIndex] = useState(0)
	const [patient, setPatient] = useState(PatientDefault)
	const [email, setEmail] = useState("safdl@garsd.com")

	useEffect(() => {
		getPatient();
	}, [])

	const getPatient = async () => {
		try {
			const response = await axios.post('http://localhost:8080/getPatientByEmail', {
				email: email,
			});
	
			const data = await response.data;
			setPatient(data.patient)
			//console.log(data.patient)
		} catch (error) {
			console.error('Error:', error);
		}
	};


	return (
		<SidebarContext.Provider value={[activeTabIndex, setActiveTabIndex]}>
			<PatientContext.Provider value={[patient, setPatient]}>
				<div className="healthaid font-outfit min-h-screen flex flex-col bg-background">
					<header className="last:sticky flex top-0 h-15 items-center">
						<aside className="w-full md:w-60 top-0 h-14 flex justify-center items-center">
							<div className="text-3xl font-bold">HealthAid</div>
						</aside>
						<Navbar/>
					</header>
					
					<div className="flex flex-col md:flex-row flex-1">
						<aside className="w-full md:w-60 pr-2 h-[calc(100vh-56px)]">
							<Sidebar/>
						</aside>
						<div className="flex-1 bg-white rounded-tl-3xl">
								{children}
						</div>
					</div>
				</div>
			</PatientContext.Provider>
		</SidebarContext.Provider>
	);
}