import { getClinic as getCli } from "@database/doctor/Get/getClinic";
import { Request, Response } from "express";

export async function getClinic(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const clinicId = body.clinicId;
    let clinicDTO = await getCli(clinicId);
    return res.json({ message: "Success", patient: clinicDTO });
  } catch (error) {
    return res.status(400).send(error);
  }
}
