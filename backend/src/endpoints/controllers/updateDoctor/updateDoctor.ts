import { Request, Response } from "express";
import { updateDoctor as updateDoc } from "@database/doctor/Update/updateDoctor";

export async function updateDoctor(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorId = body.doctorId;
    const fieldsToAdd = body.add;
    const fieldsToRemove = body.remove;
    await updateDoc(doctorId, fieldsToAdd, fieldsToRemove);
    return res.json({ message: "Doctor Information Updated!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
