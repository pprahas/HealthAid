import { Request, Response } from "express";
import { Patient, PatientDTO } from "@models/Patient"; // Import the Patient model and document types
import { pbkdf2Sync } from "crypto";

export enum LoginPatientError {
  unsuccessfulLogin = "Incorrect Email or Password. Try Again.",
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const patient = req.body as Patient;
    const email = patient.email;
    const password = patient.password;

    const patientAccount = await PatientDTO.findOne({ email: email });

    if (!patientAccount) {
      return res
        .status(403)
        .send({ message: LoginPatientError.unsuccessfulLogin });
    }
    let hashedInputPassword = pbkdf2Sync(
      password,
      "",
      10000,
      64,
      "sha512"
    ).toString("hex");

    if (hashedInputPassword === patientAccount.password) {
      return res
        .status(200)
        .send({ message: "Success", patient: patientAccount });
    }
    return res
      .status(400)
      .send({ message: LoginPatientError.unsuccessfulLogin });
  } catch (error) {
    return res.status(400).send(error);
  }
}
