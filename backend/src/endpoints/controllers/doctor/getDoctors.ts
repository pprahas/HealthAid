import { Request, Response } from "express";
import { getDoctors as getDoc } from "@database/doctor/Get/getDoctors";
export async function getDoctors(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const doctors = await getDoc();
    return res.status(200).send(doctors);
  } catch (error) {
    return res.status(400).send(error);
  }
}
