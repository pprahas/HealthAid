import { Request, Response } from "express";

import { getPrescription as getPr } from "@database/prescription/Get/getPrescription";

export async function getPrescription(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    const id = body.id;
    const prescriptions = await getPr(id);
    return res.status(200).send(prescriptions);
  } catch (error) {
    return res.status(400).send(error);
  }
}
