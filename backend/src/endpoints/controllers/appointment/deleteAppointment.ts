import { Request, Response } from "express";
import { deleteAppointment as deleteAppo } from "@database/appointment/Set/deleteAppointment";

export async function deleteAppointment(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorId = body.doctorId;
    const patientId = body.patientId;
    const appointmentId = body.appointmentId;
    await deleteAppo(patientId, doctorId, appointmentId);
    return res.status(200).send({ message: "appointment deleted" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
