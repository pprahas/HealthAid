import { Request, Response } from "express";
import { createRequest as createReq } from "@database/doctorRequest/createRequest";
import { DoctorRequest } from "@models/DoctorRequest";

export async function createRequest(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const doctorRequest = req.body as DoctorRequest;
    await createReq(doctorRequest);
    return res.json({ message: "Request Reviewed!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
