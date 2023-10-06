import { Request, Response } from "express";

import { updateDiagnosis as updateDia } from "@database/doctor/Update/updateDiagnosis";
export async function updateDiagnosis(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const conversationId = body.conversationId as string;
    // console.log(conversationId);
    const diagnosis = body.diagnosis;
    const doctorEmail = body.doctorEmail;
    let assignedDoctorId = await updateDia(conversationId, diagnosis, doctorEmail);
    // console.log("its bnack hee as well")
    return res.status(200).send(assignedDoctorId);
  } catch (error) {
    return res.status(400).send(error);
  }
}
