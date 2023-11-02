import { Request, Response } from "express";
import { updatePatient as updatePat } from "@database/patient/Update/updatePatient";

export async function updatePatient(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const patientId = body.patientId;
    const fieldsToAdd = body.add;
    const fieldsToRemove = body.remove;
    const responseMessages = await updatePat(
      patientId,
      fieldsToAdd,
      fieldsToRemove
    );
    return res.status(200).send(responseMessages);
  } catch (error) {
    return res.status(400).send(error);
  }
}
