import { Request, Response } from "express";
import { createAppointment as createAppo } from "@database/appointment/Set/createAppointment";

export async function createAppointment(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorId = body.doctorId;
    const patientId = body.patientId;
    const title = body.title;
    const time = body.time;
    await createAppo(patientId, doctorId, time, title);
    return res.status(200).send({ message: "appointment created" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
