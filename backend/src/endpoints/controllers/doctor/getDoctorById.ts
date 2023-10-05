import { getDoctorById } from "@database/doctor/Get/getDoctorById";
import { Request, Response } from "express";

export async function getDoctorByIdController(req: Request, res: Response): Promise<Response> {
  try {
    const id = req.body.id as string
    console.log("/getDoctorById - Fetching: " + req.body.id)
    let doctorDTO = await getDoctorById(id)
    return res.json({ message: "Success", doctor: doctorDTO });
  } catch(error) {
    return res.status(400).send(error)
  }
} 