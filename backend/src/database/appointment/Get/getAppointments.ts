import { AppointmentDTO } from "@models/Appointment";
import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum AppointmentError {
  noAccountFound = "Patient/Doctor account with the given ID does not exist",
}

export async function getAppointment(id) {
  try {
    let account = await PatientDTO.findById(id);
    if (!account) {
      account = await DoctorDTO.findById(id);
    }

    if (!account) {
      throw AppointmentError.noAccountFound;
    }

    const appointmentIds = account.appointments;

    let appointments = [];

    for (const appointmentId of appointmentIds) {
      let appointment = AppointmentDTO.findById(appointmentId);
      appointments.push((await appointment).toObject());
    }

    return appointments;
  } catch (error) {
    throw error;
  }
}
