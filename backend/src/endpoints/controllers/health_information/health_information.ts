import { Request, Response } from "express";
import { updateHealthInformation } from "@database/patient/Set/createHealthInformation";

export async function update_health_information(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    await updateHealthInformation(body);
    return res.json({ message: "Patient Information Updated!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
