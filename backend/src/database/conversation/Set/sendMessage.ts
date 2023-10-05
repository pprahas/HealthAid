export enum ConversationError { }

import { ConversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";
import { AskGPT } from "@endpoints/controllers/AI/gpt";
import { PatientDTO } from "@models/Patient";
import { HealthInformationDTO } from "@models/HealthInformation";

export async function sendMessage(patientId: String, conversationId: String, message: Message) {
    try {
        // 1. Create and save the new message
        const newMessage = new MessageDTO(message);
        await newMessage.save();

        // 2. Add the new message's ObjectId to the Conversation's messages array and retrieve the updated conversation
        const updatedConversation = await ConversationDTO.findByIdAndUpdate(
            conversationId,
            { $push: { messages: newMessage._id } },
            { new: true, useFindAndModify: false }
        );

        // 3. Fetch all messages by their ObjectId
        const allMessageDTOs: Message[] = await MessageDTO.find({
            '_id': { $in: updatedConversation.messages }
        });

        // 4. Store the fetched messages in an array
        const allMessages: Message[] = allMessageDTOs.map(msg => ({
            senderType: msg.senderType,
            content: msg.content
        }));

        const patientAccount = await PatientDTO.findById(patientId);
        const healthInformation = patientAccount.healthInfo;

        let promptToGPT = `Hello ChatGPT. I am a medical professional using this AI to assist with patient assessments. I have the following health information about the patient:`;

        for (const healthInfoId of healthInformation) {
            const healthInfoObject = await HealthInformationDTO.findById(
                healthInfoId
            );
            if (healthInfoObject) {
                promptToGPT += `
        Question: ${healthInfoObject.question} Answer: ${healthInfoObject.answer} `;
            }
        }

        console.log("All Messages:", allMessages);
        let gptResponse = AskGPT(promptToGPT, allMessages, conversationId)
        console.log(gptResponse);
        return gptResponse

    } catch (err) {
        console.log("error:", err);
        throw err;
    }
}

