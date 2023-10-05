import React from "react";
import { ChatContainer } from "../../../components/chatContainer"
import { messages } from "./testConvo"
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function PatientHome() {

    return(
        
        <section className="columns-2 items-start h-full">
            <div className="w-full h-full pt-9 pl-10">
                <h1 className="font-bold text-4xl">Patient Name</h1>
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