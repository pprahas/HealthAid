import { createPatient } from "@database/patient/Set/createPatient";
import { Request, Response } from "express";
import { Patient } from "@models/Patient";
import { Doctor } from "@models/Doctor";
import { createDoctor } from "@database/doctor/Set/createDoctor";

export async function registerPatient(req: Request, res: Response): Promise<Response> {
  try {
    const patient = req.body as Patient
    console.log(patient)
    let patientDTO = await createPatient(patient)
    return res.json({ message: "Success", patient: patientDTO });
  } catch(error) {
    return res.status(400).send(error)
  }
} 


export async function registerDoctor(req: Request, res: Response): Promise<Response> {
  try {
    const doctor = req.body as Doctor
    console.log(doctor)
    let doctorDTO = await createDoctor(doctor)
    return res.json({ message: "Success", doctor: doctorDTO });
  } catch(error) {
    return res.status(400).send(error)
  }
} 