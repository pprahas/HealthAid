import { Request, Response } from "express";
import { createConversation as createConvo } from "@database/conversation/Set/createConversation";
import { sendMessage as sendMessageToGpt } from "@database/conversation/Set/sendMessage";

export async function createConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    let patientDTO = await createConvo(body);
    return res.status(200).send(patientDTO);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    let conversationId = req.body.conversationId
    let newMessage = req.body.newMessage
    let gptResponse = await sendMessageToGpt(conversationId, newMessage)
    return res.status(200).send(gptResponse)
    return
  } catch (error) {
    return res.status(400).send(error);
  }
  return ""
}
