import { PatientDTO } from "@models/Patient"; // Import the Patient model and document types
import {
  HealthInformation,
  HealthInformationDTO,
} from "@models/HealthInformation";
import mongoose from "mongoose"; // Import mongoose

export enum HealthInformationError {
  unsuccessfulLogin = "Incorrect Email.",
}

export async function updateHealthInformation(body) {
  try {
    const email = body.email;

    const information = body.information;

    const patientAccount = await PatientDTO.findOne({ email: email });

    if (!patientAccount) {
      throw HealthInformationError.unsuccessfulLogin;
    }

    for (const key in information) {
      const value = information[key];
      const newHealthInfo: HealthInformation = {
        question: key,
        answer: value,
      };

      const healthInfoObjectId = new mongoose.Types.ObjectId();
      patientAccount.healthInfo.push(healthInfoObjectId);

      await HealthInformationDTO.create({
        _id: healthInfoObjectId,
        question: newHealthInfo.question,
        answer: newHealthInfo.answer,
      });
    }

    await patientAccount.save();

    patientAccount.healthInfo.push;
  } catch (error) {
    throw error;
  }
}
