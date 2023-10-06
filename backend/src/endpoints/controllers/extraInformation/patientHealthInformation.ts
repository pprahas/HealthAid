import { Request, Response } from "express";
import { createHealthInformation } from "@database/patient/Set/createHealthInformation";
import { HealthInformationDTO } from "@models/HealthInformation";

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

// Array of object ids in healthinformations query id 
export async function getHealthInformation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const ids = body.healthInfoIds; // Assuming you have an array of IDs in 'ids'

    const healthInformationObjects = [];

    for (const id of ids) {
      const healthInformation = await HealthInformationDTO.findOne({ _id: id });
      healthInformationObjects.push(healthInformation);
    }

    return res.json({ healthInformationObjects });
  } catch (error) {
    return res.status(400).send(error);
  }
}
