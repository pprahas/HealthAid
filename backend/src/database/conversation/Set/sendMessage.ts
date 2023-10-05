export enum ConversationError { }

import { conversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";
import { AskGPT } from "@endpoints/controllers/AI/gpt";

const DEFAULT_PROMPT = "Hey there"

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

