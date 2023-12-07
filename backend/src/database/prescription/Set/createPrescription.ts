import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";
import { PrescriptionDTO } from "@models/Prescription";

export enum PrescriptionError {
  patientAccountNotFound = "Patient account with the given ID does not exist",
  doctorAccountNotFound = "Doctor account with the given ID does not exist",
}
export async function createPrescription(
  patientId,
  doctorId,
  date,
  reminderCycle,
  name,
  remainingRefills
) {
  try {
    const patientAccount = await PatientDTO.findById(patientId);
    if (!patientAccount) {
      throw PrescriptionError.patientAccountNotFound;
    }

    const doctorAccount = await DoctorDTO.findById(doctorId);
    if (!doctorAccount) {
      throw PrescriptionError.doctorAccountNotFound;
    }

    const newPrescription = new PrescriptionDTO({
      patientId: patientId,
      doctorId: doctorId,
      date: date,
      reminderCycle: reminderCycle,
      name: name,
      remainingRefills: remainingRefills,
    });

    patientAccount.prescriptions.push(newPrescription._id);
    doctorAccount.prescriptions.push(newPrescription._id);

    await newPrescription.save();
    await patientAccount.save();
    await doctorAccount.save();
  } catch (error) {
    throw error;
  }
}
