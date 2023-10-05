import { DoctorDTO } from "@models/Doctor"; // Import the Doctor model and document types
import { ClinicDTO } from "@models/Clinic";
import mongoose from "mongoose"; // Import mongoose

export enum ClinicInformationError {
  unsuccessfulLogin = "Doctor email does not exist with the email.",
}

export async function createClinicInformation(doctorEmail, clinicInfo) {
  try {
    const doctorAccount = await DoctorDTO.findOne({ email: doctorEmail });
    if (!doctorAccount) {
      // throw new Error(ClinicInformationError.unsuccessfulLogin);
      throw ClinicInformationError.unsuccessfulLogin;
    }
    // return doctorAccount;
    // return clinicInfo;
    const clinicInfoObjectId = new mongoose.Types.ObjectId();
    doctorAccount.clinic = clinicInfoObjectId;
    let newClinic = await ClinicDTO.create({
      _id: clinicInfoObjectId,
      name: clinicInfo.name,
      postalCode: clinicInfo.postalCode,
      website: clinicInfo.website,
      phoneNumber: clinicInfo.phoneNumber,
      specialties: clinicInfo.specialties,
    });
    await doctorAccount.save();
    return newClinic;
  } catch (error) {
    throw error;
  }
}
