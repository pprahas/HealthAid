import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";
import { PrescriptionDTO } from "@models/Prescription";
export enum AppointmentError {
  noAccountFound = "Patient/Doctor account with the given ID does not exist",
}
export async function getPrescription(id) {
  try {
    let account = await PatientDTO.findById(id);
    if (!account) {
      account = await DoctorDTO.findById(id);
    }

    if (!account) {
      throw AppointmentError.noAccountFound;
    }

    const prescriptionsIds = account.prescriptions;

    let prescriptions = [];

    for (const prescriptionId of prescriptionsIds) {
      let prescription = PrescriptionDTO.findById(prescriptionId);
      prescriptions.push((await prescription).toObject());
    }

    return prescriptions;
  } catch (error) {
    throw error;
  }
}
