import { Request, Response } from "express";
import { editAppointment as editAppo } from "@database/appointment/Update/updateAppointment";

export async function editAppointment(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const appointmentId = body.appointmentId;
    const fieldsToEdit = body.edit;
    await editAppo(appointmentId, fieldsToEdit);
    return res.status(200).send({ message: "appointment edited" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
