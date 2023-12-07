import { Request, Response } from "express";

import { updateRequestedRefills as updateReq } from "@database/prescription/Update/updateRequestedRefills";

export async function updateRequestedRefills(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const prescriptionId = body.prescriptionId;
    const requestedRefills = body.requestedRefills;
    await updateReq(prescriptionId, requestedRefills);
    return res.status(200).send({ message: "requested refills" });
  } catch (error) {
    return res.status(400).send(error);
  }
}
