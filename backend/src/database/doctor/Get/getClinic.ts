import { ClinicDTO } from "@models/Clinic";

export async function getClinic(clinicId) {
  try {
    const clinicObj = await ClinicDTO.findById(clinicId);
    if (!clinicObj) {
      throw new Error("No Clinic Object found");
    }

    return clinicObj.toObject();
  } catch (error) {
    throw error;
  }
}
