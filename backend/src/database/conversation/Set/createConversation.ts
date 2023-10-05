import { Conversation, conversationDTO } from "@models/Conversation";
import mongoose from "mongoose";

export enum ConversationError {}

export async function createConversation(body){
    try{
        const patientEmail = body.patientEmail
        const doctorEmail = body.doctorEmail



    }
}
