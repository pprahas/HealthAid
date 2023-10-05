import { getPatient } from "@database/patient/Get/getPatient";
import { Request, Response } from "express";

export async function getPatientByEmail(req: Request, res: Response): Promise<Response> {
  try {
    const email = req.body.email as string
    console.log("/getPatientByEmail - Fetching: " + req.body.email)
    let patientDTO = await getPatient(email)
    return res.json({ message: "Success", patient: patientDTO });
  } catch(error) {
    return res.status(400).send(error)
  }
} 