import { Message, MessageDTO } from "@models/Message";
import OpenAI from "openai"
import { Request, Response } from "express";
import { ConversationDTO } from "@models/Conversation";

export async function AskGPTWrapper(req: Request, res: Response) {
    try {
        let prompt = req.body.prompt
        let messages: [Message] = req.body.messages
        let conversationId = req.body.conversationId
        let response = await AskGPT(prompt, messages, conversationId)
        res.status(200).send(response)
    } catch (error) {
        return res.status(400).send(error);
    }
}

export async function AskGPT(prompt: String, messages: ([Message] | Message[]), conversationId: String) {
    try {
        console.log("asking gpt")
        let formattedMessages: any[] = []
        if (messages) {
            formattedMessages = messages.map((message) => ({
                role: message.senderType === "gpt" ? "assistant" : "user",
                content: message.content
            }));
        }

        // If you also want to include the prompt in the messages, you can do:
        formattedMessages.push({ role: "assistant", content: prompt });

        const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

        const chatCompletion = await openai.chat.completions.create({
            messages: formattedMessages,
            model: "gpt-3.5-turbo",
        });
        console.log(formattedMessages);
        console.log(chatCompletion)
        let message = chatCompletion.choices[0].message.content

        // 1. Create and save the new message
        const newMessage = new MessageDTO(message);
        await newMessage.save();

        // 2. Add the new message's ObjectId to the Conversation's messages array and retrieve the updated conversation
        await ConversationDTO.findByIdAndUpdate(
            conversationId,
            { $push: { messages: newMessage._id } },
            { new: true, useFindAndModify: false }
        );

        return (chatCompletion.choices);
    } catch (error) {
        console.log("failed")
        console.log(error);
        throw error
    }
}
