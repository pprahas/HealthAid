import { Request, Response } from "express";
import { PatientDTO } from "@models/Patient"; // Import the Patient model and document types
import { pbkdf2Sync } from "crypto";
import { DoctorDTO } from "@models/Doctor";

export enum LoginPatientError {
  unsuccessfulLogin = "Incorrect Email or Password. Try Again.",
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    const patientAccount = await PatientDTO.findOne({ email: email });

    if (patientAccount) {
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
          .send({ message: "Success", user: patientAccount });
      }
    }

    const doctorAccount = await DoctorDTO.findOne({ email: email });

    if (doctorAccount) {
      let hashedInputPassword = pbkdf2Sync(
        password,
        "",
        10000,
        64,
        "sha512"
      ).toString("hex");

      if (hashedInputPassword === doctorAccount.password) {
        return res
          .status(200)
          .send({ message: "Success", user: doctorAccount });
      }
    }

    return res
      .status(403)
      .send({ message: LoginPatientError.unsuccessfulLogin });
  } catch (error) {
    return res.status(400).send(error);
  }
}
