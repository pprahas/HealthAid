import { Request, Response } from "express";

import { updateRequests as updateRe } from "@database/prescription/Update/updateRequests";

export async function updateRequests(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const prescriptionId = body.prescriptionId;
    const action = body.action;
    await updateRe(prescriptionId, action);
    return res.status(200).send({ message: "remaining refills updated" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
