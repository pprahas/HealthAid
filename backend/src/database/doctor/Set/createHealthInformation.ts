import { DoctorDTO } from "@models/Doctor"; // Import the Doctor model and document types
import { Clinic, ClinicDTO } from "@models/Clinic";
import mongoose from "mongoose"; // Import mongoose

export enum ClinicInformationError {
  unsuccessfulLogin = "Incorrect Email.",
}

export async function createHealthInformation(body) {
  try {
    const email = body.email;

    const information = body.information;

    const doctorAccount = await DoctorDTO.findOne({ email: email });

    if (!doctorAccount) {
      throw ClinicInformationError.unsuccessfulLogin;
    }

    for (const key in information) {
      const value = information[key];
      const newHealthInfo: HealthInformation = {
        question: key,
        answer: value,
      };

      const healthInfoObjectId = new mongoose.Types.ObjectId();
      doctorAccount.healthInfo.push(healthInfoObjectId);

      await HealthInformationDTO.create({
        _id: healthInfoObjectId,
        question: newHealthInfo.question,
        answer: newHealthInfo.answer,
      });
    }

    await doctorAccount.save();

    doctorAccount.healthInfo.push;
  } catch (error) {
    throw error;
  }
}
