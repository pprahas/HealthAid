import { PatientDTO } from "@models/Patient"; // Import the Patient model and document types
import {
  HealthInformation,
  HealthInformationDTO,
} from "@models/HealthInformation";
import mongoose from "mongoose"; // Import mongoose

export enum Questions {
  "1Q" = "Any allergies?",
  "2Q" = "Chronic conditions?",
  "3Q" = "Current medications or supplements?",
  "4Q" = "Current symptoms or concerns?",
  "5Q" = "Current pain or discomfort?",
  "6Q" = "Recent weight changes?",
  "7Q" = "Exercise routine?",
  "8Q" = "Dietary restrictions?",
  "9Q" = "Alcohol consumption habits?",
  "10Q" = "Tobacco or smoking habits?",
  "11Q" = "Stress level (1-10)?",
  "12Q" = "Sleep patterns?",
  "13Q" = "History of mental health treatment?",
  "14Q" = "Pregnancy plans (for females)?",
  "15Q" = "Family health history?",
  "16Q" = "Past surgeries or procedures?",
  "17Q" = "Recent travel destinations?",
  "18Q" = "Preferred pharmacy or healthcare facility?",
  "19Q" = "Specialists or healthcare providers?",
  "20Q" = "Additional health information?",
}

export enum HealthInformationError {
  unsuccessfulLogin = "Incorrect Email.",
  successfulUpdate = "The patient's health information has been successfully updated.",
}

export async function updateHealthInformation(body) {
  try {
    const email = body.email;

    const patientAccount = await PatientDTO.findOne({ email: email });

    if (!patientAccount) {
      throw HealthInformationError.unsuccessfulLogin;
    }

    const information = body.information;

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
