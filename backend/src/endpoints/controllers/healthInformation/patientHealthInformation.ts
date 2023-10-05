import { Request, Response } from "express";
import { createHealthInformation } from "@database/patient/Set/createHealthInformation";

export async function updateHealthInformation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    await createHealthInformation(body);
    return res.json({ message: "Patient Information Updated!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
