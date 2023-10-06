import { Request, Response } from "express";
import { PatientDTO } from "@models/Patient"; // Import the Patient model and document types
import { pbkdf2Sync } from "crypto";
import { DoctorDTO } from "@models/Doctor";

export enum LoginPatientError {
  invalidEmail = "No account associated with this email",
  unsuccessfulLogin = "Incorrect Email or Password. Try Again.",
}

export async function resetPassword(req: Request, res: Response): Promise<Response> {
  try {
    // const patient = req.body;
    const email = req.body.email;
    const oldPassword = req.body.password;
    const newPassword = req.body.newPassword

    let patientAccount = await PatientDTO.findOne({ email: email });

    if (!patientAccount) {
      patientAccount = await DoctorDTO.findOne({ email: email })
      if (!patientAccount) {
        return res
          .status(403)
          .send({ message: LoginPatientError.invalidEmail });
      }
    }
    let hashedInputPassword = pbkdf2Sync(
      oldPassword,
      "",
      10000,
      64,
      "sha512"
    ).toString("hex");

    if (hashedInputPassword === patientAccount.password) {
      let hashedPassword = pbkdf2Sync(newPassword, '', 10000, 64, 'sha512').toString('hex');
      patientAccount.password = hashedPassword;

      await patientAccount.save();

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
