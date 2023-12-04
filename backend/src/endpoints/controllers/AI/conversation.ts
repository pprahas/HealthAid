import { Request, Response } from "express";
import { createConversation as createConvo } from "@database/conversation/Set/createConversation";
import {
  sendMessage as sendMessageToGpt,
  sendMessageDoc as sendMessageDoctor,
  markAsSeen as markMessageSeen,
  sendMessagePat as sendMessagePatient
} from "@database/conversation/Set/sendMessage";
import { getConversations as getConvo } from "@database/conversation/Get/getConversations";
import { Message } from "@models/Message";

export async function createConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    let gptResponse = await createConvo(body);
    return res.status(200).send({ response: gptResponse });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    let patientId = req.body.patientId
    let conversationId = req.body.conversationId
    let newMessage = req.body.newMessage
    let message: Message = {
      senderType: "me",
      content: newMessage
    }
    let gptResponse = await sendMessageToGpt(patientId, conversationId, message)
    return res.status(200).send(gptResponse)
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function sendMessageDoc(req: Request, res: Response) {
  try {
    let doctorId = req.body.doctorId
    let conversationId = req.body.conversationId
    let newMessage = req.body.newMessage
    let message: Message = {
      senderType: "doctor",
      content: newMessage
    }
    let gptResponse = await sendMessageDoctor(doctorId, conversationId, message)
    return res.status(200).send(gptResponse)
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function sendMessagePat(req: Request, res: Response) {
  try {
    let doctorId = req.body.patietId
    let conversationId = req.body.conversationId
    let newMessage = req.body.newMessage
    let message: Message = {
      senderType: "me",
      content: newMessage
    }
    let gptResponse = await sendMessagePatient(doctorId, conversationId, message)
    return res.status(200).send(gptResponse)
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function markAsSeen(req: Request, res: Response) {
  try {
    let messageId = req.body.messageId
    await markMessageSeen(messageId)
    return res.status(200).send()
  } catch (error) {
    return res.status(400).send(error);
  }
}


export async function getConversations(req: Request, res: Response) {
  try {
    let patientId = req.body.patientId;
    let doctorId = req.body.doctorId;
    let conversations = await getConvo(patientId, doctorId);
    return res.status(200).send(conversations);
  } catch (error) {
    return res.status(400).send(error);
  }
}