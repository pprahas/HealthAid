import { Request, Response } from "express";
import { getAppointment as getAppo } from "@database/appointment/Get/getAppointments";

export async function getAppointments(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const id = body.id;
    let appointments = await getAppo(id);
    return res.status(200).send(appointments);
  } catch (error) {
    return res.status(400).send(error);
  }
}
