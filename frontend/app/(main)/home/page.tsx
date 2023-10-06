'use client'
import React, { useEffect } from "react";
import { ChatContainer } from "../../../components/chatContainer"
import { messages } from "./testConvo"
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import { SidebarContext } from "@/app/(main)/layout";
import { PatientContext } from "@/app/(main)/layout";
import { SetStateAction, useContext, useState } from "react";
import { Patient, PatientDefault } from "@/types";
import { Doctor, DoctorDefault } from "@/types";
import { ConversationList, Conversation } from "./conversation";
import { RightArrow } from "@/components/rightArrow";


export default function PatientHome() {

    const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as any[]
    const [patient, setPatient] = useContext(PatientContext) as [Patient, React.Dispatch<React.SetStateAction<Patient>>]
    const [doctor, setDoctor] = useState(DoctorDefault)
    const [convoIndex, setConvoIndex] = useState(0)

    const getDoctorInfo = async () => {
        
        if (typeof patient.doctors === 'undefined' || patient.doctors.length == 0) {
            setDoctor(DoctorDefault)
            return;
        }
		try {
			const response = await axios.post('http://localhost:8080/getDoctorFromId', {
				id: patient.doctors[sidebarIndex] 
			})
	
			const data = await response.data;
            setDoctor(data.doctor)
		} catch (error) {
			console.error('Error:', error);
		}
	};

    useEffect(() => {
        getDoctorInfo();
    }, [sidebarIndex, patient])

    return(
        
        <section className="columns-2 items-start h-[calc(100vh-60px)]">
            <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden">
                <h1 className="font-bold text-4xl">Dr. {doctor.firstName} {doctor.lastName}</h1>
                <div className="overflow-auto h-full  my-3">
                    <div className="grid grid-cols-2 gap-y-3 text-2xl">
                        <div>
                            <p className="font-bold">Clinic name</p>
                            <p>Address</p>
                            <p>City</p>
                            <p>Zip Code</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p>Phone number</p>
                            <p>Website</p>
                            <p className="my-3">
                                <Button size="lg" color="success" className="text-xl shadow-md">Book appointment</Button>
                            </p>
                            
                        </div>
                    </div>
                    
                    <h1 className="font-bold text-4xl pt-24">Your Conversations</h1>
                    <div className="space-y-5 pt-5">
                        {ConversationList?.map((conversation, index: number) => (
                            <div key={index} className={`${convoIndex == index ? 'bg-background font-bold' : 'cursor-pointer bg-slate-200 hover:bg-secondary-300 transition duration-500'} text-xl shadow-md rounded-3xl p-2 pr-3 pl-5 flex items-center justify-between`} onClick={() => {
                                setConvoIndex(index)
                                //TODO Change displayed conversation
                            }}>
                                <div>
                                    {conversation.title}
                                </div>
                                <div>
                                    <RightArrow/>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    
                </div>
            </div>
            <div className="h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
                <div className="font-bold h-16 text-4xl pr-10">Conversation with AI</div>
                <div className="flex-grow overflow-y-auto snap-y">
					<ChatContainer messages={messages}/>
                </div>
                <div className="h-min my-1 place-items-center">
                    <div className="flex space-x-1 pr-10">
                        <Textarea
                            maxRows={2}
                            placeholder="Tell ChatGPT about your symptoms"
                            size="lg"
                        />
                        <Button
                            color="success"
                            className="h-16 my-1.5 shadow-md"
                        >
                            <div className="font-bold">Send</div>
                        </Button>
                        
                    </div>
                    
                </div>
            </div>
        </section>
    )
}