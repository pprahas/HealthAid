import { getPatientById } from "@database/patient/Get/getPatientById";
import { Request, Response } from "express";

export async function getPatientByIdController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.body.id as string
      console.log("/getPatientById - Fetching: " + req.body.id)
      let patientDTO = await getPatientById(id)
      return res.json({ message: "Success", patient: patientDTO });
    } catch(error) {
      return res.status(400).send(error)
    }
  } 