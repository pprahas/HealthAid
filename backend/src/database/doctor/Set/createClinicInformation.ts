import { DoctorDTO } from "@models/Doctor"; // Import the Doctor model and document types
import { ClinicDTO } from "@models/Clinic";

export enum ClinicInformationError {
  unsuccessfulLogin = "Doctor email does not exist with the email.",
}

export async function createClinicInformation(doctorEmail, clinicInfo) {
  try {
    const doctorAccount = await DoctorDTO.findOne({ email: doctorEmail });
    if (!doctorAccount) {
      throw ClinicInformationError.unsuccessfulLogin;
    }
    const newClinic = new ClinicDTO(clinicInfo)
    await newClinic.save();

    doctorAccount.clinic = newClinic._id;
    await doctorAccount.save();

    return newClinic;
  } catch (error) {
    throw error;
  }
}
