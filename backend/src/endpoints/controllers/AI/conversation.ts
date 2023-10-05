import { Request, Response } from "express";
import { createConversation as createConvo } from "@database/conversation/Set/createConversation";

export async function createConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    let patientDTO = await createConvo(body);
    return res.json({ message: patientDTO });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function sendMessage() {
  return ""
}
