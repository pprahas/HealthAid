import { Request, Response } from "express";
import { createPrescription as createPre } from "@database/prescription/Set/createPrescription";

export async function createPrescription(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorId = body.doctorId;
    const patientId = body.patientId;
    const date = body.date;
    const reminderCycle = body.reminderCycle;
    const name = body.name;
    const remainingRefills = body.remainingRefills;
    await createPre(
      patientId,
      doctorId,
      date,
      reminderCycle,
      name,
      remainingRefills
    );
    return res.status(200).send({ message: "prescription created" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
