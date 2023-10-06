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


export default function DoctorHome() {

    return(
        
        <section className="columns-2 items-start h-[calc(100vh-60px)]">
            <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden">
                <h1 className="font-bold text-4xl">Doctor Homepage</h1>
                
            </div>
            <div className="h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
                <div className="font-bold h-16 text-4xl pr-10">Patient's Conversation with AI</div>
            </div>
        </section>
    )
}