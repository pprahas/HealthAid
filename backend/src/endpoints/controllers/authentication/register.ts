import { createPatient } from "@database/patient/Set/createPatient";
import { Request, Response } from "express";
import { Patient } from "@models/Patient";

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const patient = req.body as Patient
    console.log(patient)
    let patientDTO = await createPatient(patient)
    return res.json({ message: "Success", patient: patientDTO });
  } catch(error) {
    return res.status(400).send(error)
  }
} 