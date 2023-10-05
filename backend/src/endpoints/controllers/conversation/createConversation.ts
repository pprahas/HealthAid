import { Request, Response } from "express";
import { createConversation } from "@database/conversation/Set/createConversation";

export async function conversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    let patientDTO = await createConversation(body);
    return res.json({ message: patientDTO });
  } catch (error) {
    return res.status(400).send(error);
  }
}
