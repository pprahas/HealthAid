import { Message, MessageDTO } from "@models/Message";
import OpenAI from "openai";
import { Request, Response } from "express";
import { ConversationDTO } from "@models/Conversation";

const DEFAULT_PROMPT = `Now, I want you to act like a doctor, introduce yourself to the patient humanly, and be friendly. Introduce yourself as ChatGPT, not any doctor, and keep the introduction message short and ask the patient about their current health concerns. If you think you have a diagnosis for the patient after talking to them for a while, respond with "you have been diagnosed with: " and then include the diagnosis. don't tell them to seek medical attention, and tell them to forward this entire conversation with the diagnosis to a doctor if they want to. Don't include the health information i have provided above in the introductory message, but do keep them in mind when providing a diagnosis. Ask as many questions as possible, at least 3 minimum questions. Keep your responses to 1-3 sentences max. Once you have a diagnosis that we can send to a real doctor, return it in this format "**Diagnosis**:{Diagnosis}"`;
// const DEFAULT_PROMPT = `I want you to act like a doctor, introduce yourself to the patient humanly, and be friendly. Introduce yourself as ChatGPT, not any doctor, and keep the introduction message short and ask the patient about their current health concerns.`;

export async function AskGPTWrapper(req: Request, res: Response) {
  try {
    let messages: [Message] = req.body.messages;
    let conversationId = req.body.conversationId;
    let response = await AskGPT("", messages, conversationId);
    res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function AskGPT(
  prompt: String,
  messages: [Message] | Message[],
  conversationId: String
) {
  try {
    console.log("asking gpt");
    let formattedMessages: any[] = [];

    formattedMessages.push({ role: "system", content: prompt });
    formattedMessages.push({ role: "system", content: DEFAULT_PROMPT });
    formattedMessages.push({
      role: "system",
      content: "This is the conversation that you have already had",
    });

    if (messages && messages.length != 0) {
      formattedMessages = messages.map((message) => ({
        role: message.senderType === "gpt" ? "assistant" : "user",
        content: message.content,
      }));
    }

    formattedMessages.push({
      role: "system",
      content:
        "What will your next response be? Only respond with questions on symptoms. If you come up with a diagnosis and are ready for us to send it to a real doctor, i want you to say 'Ready for Review' at which point, a real human will look over your messages. If a user says 'Give me the diagnosis', give a diagnosis with all the information you know and say 'Ready for Review' at the end",
    });

    const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

    const chatCompletion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-3.5-turbo",
    });
    console.log(formattedMessages);
    console.log(chatCompletion);

    let message: Message = {
      senderType: "gpt",
      content: chatCompletion.choices[0].message.content,
    };
    // 1. Create and save the new message
    const newMessage = new MessageDTO(message);
    await newMessage.save();

    // 2. Add the new message's ObjectId to the Conversation's messages array and retrieve the updated conversation
    await ConversationDTO.findByIdAndUpdate(
      conversationId,
      { $push: { messages: newMessage._id } },
      { new: true, useFindAndModify: false }
    );

    return message;
  } catch (error) {
    console.log("failed");
    console.log(error);
    throw error;
  }
}
