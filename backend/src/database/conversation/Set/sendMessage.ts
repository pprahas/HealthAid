export enum ConversationError { }

import { conversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";
import { AskGPT } from "@endpoints/controllers/AI/gpt";

export const DEFAULT_PROMPT = `Now, I want you to act like a doctor, introduce yourself to the patient humanly, and be friendly. Introduce yourself as ChatGPT, not any doctor, and keep the introduction message short and ask the patient about their current health concerns. If you think you have a diagnosis for the patient after talking to them for a while, respond with "you have been diagnosed with: " and then include the diagnosis. don't tell them to seek medical attention, and tell them to forward this entire conversation with the diagnosis to a doctor if they want to. Don't include the health information i have provided above in the introductory message, but do keep them in mind when providing a diagnosis. Ask as many questions as possible, at least 3 minimum questions. `;

export async function sendMessage(conversationId: String, message: Message) {
    try {
        // 1. Create and save the new message
        const newMessage = new MessageDTO(message);
        await newMessage.save();

        // 2. Add the new message's ObjectId to the Conversation's messages array and retrieve the updated conversation
        const updatedConversation = await conversationDTO.findByIdAndUpdate(
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

        console.log("All Messages:", allMessages);
        let gptResponse = AskGPT(DEFAULT_PROMPT, allMessages)
        console.log(gptResponse);
        return gptResponse

    } catch (err) {
        console.log("error:", err);
        throw err;
    }
}

