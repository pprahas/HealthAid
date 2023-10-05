import { Request, Response } from "express";
import { createClinicInformation as createClinicInfo } from "@database/doctor/Set/createClinicInformation";

export async function createClinicInformation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorEmail = body.email;
    const clinicInfo = body.clinicInfo;
    let obj = await createClinicInfo(doctorEmail, clinicInfo);
    return res.json(obj);
  } catch (error) {
    return res.status(400).send(error);
  }
}
