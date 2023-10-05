import { Message } from "@models/Message";
import { Request, Response } from "express";
import OpenAI from "openai";

export async function AskGPTWrapper(req: Request, res: Response) {
  try {
    let prompt = req.body.prompt
    let messages: [Message] = req.body.messages
    let response = await AskGPT(prompt, messages)
    res.status(200).send(response)
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function AskGPT(prompt: String, messages: [Message]) {
  try {
    console.log("asking gpt")
    let formattedMessages: { role: string; content: String; }[] = []
    if (messages) {
      formattedMessages = messages.map((message) => ({
        role: message.senderType === "gpt" ? "assistant" : "user",
        content: message.content
      }));
    }

    // If you also want to include the prompt in the messages, you can do:
    formattedMessages.push({ role: "user", content: prompt });

    const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

    const chatCompletion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-3.5-turbo",
    });
    console.log(formattedMessages);
    console.log(chatCompletion)

    return (chatCompletion.choices);
  } catch (error) {
    console.log("failed")
    console.log(error);
    throw error
  }
}
