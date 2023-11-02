import { Request, Response } from "express";
import { createRequest as createReq } from "@database/doctorRequest/createRequest";

export async function createRequest(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorEmail = body.doctorEmail;
    const diploma = body.diploma;
    const npi = body.npi;
    await createReq(doctorEmail, diploma, npi);
    return res.json({ message: "Request Reviewed!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
