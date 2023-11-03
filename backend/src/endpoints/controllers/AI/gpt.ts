import { Message, MessageDTO } from "@models/Message";
import OpenAI from "openai";
import { Request, Response } from "express";
import { ConversationDTO } from "@models/Conversation";

const DEFAULT_PROMPT = "You are an AI doctor that will come up with an inital AI diagnosis"

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
        "What will your next response be? Format your response in a user friendly way.\n" +
        "List extra questions you might have in an ordered list\n" +
        "If you come up with an inital AI diagnosis and are ready for us to send it to a real doctor for approval, " +
        "I want you to reply with 'Diagnosis: {3 sentence summary of the diagnosis}'.\n" +
        "If you have sent more than 5 messages and still cannot figure out an initial AI diagnosis, I want you to reply with 'Diagnois: Could get get, sending to doctor for further review'\n" +
        "Your response should be less than 3 sentences" +
        "Use **nn** if you want to use a new line character" +
        "You should wait atleast for atleast 1 message from the user before responding with the diagnosis"
    });

    const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

    const chatCompletion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4",
    });
    console.log(formattedMessages);
    console.log(chatCompletion);

    let messageText = chatCompletion.choices[0].message.content;
    messageText = messageText.replace(/\n/g, "**nn**");


    let message: Message = {
      senderType: "gpt",
      content: messageText,
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
