import { Request, Response } from "express";
import { reviewRequest as reviewReq } from "@database/doctorRequest/reviewRequest";

export async function reviewRequest(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const doctorEmail = body.doctorEmail;
    const approval = body.approval;
    await reviewReq(doctorEmail, approval);
    return res.json({ message: "Request Reviewed!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
