import { AppointmentDTO } from "@models/Appointment";
import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum AppointmentError {
  patientAccountNotFound = "Patient account with the given ID does not exist",
  doctorAccountNotFound = "Doctor account with the given ID does not exist",
  appointmentNotFound = "Appointment with the given ID does not exist",
  patientAppointmentNotFound = "Patient appointment with the given ID does not exist",
  doctorAppointmentNotFound = "Doctor appointment with the given ID does not exist",
}

export async function deleteAppointment(patientId, doctorId, appointmentId) {
  try {
    const patientAccount = await PatientDTO.findById(patientId);
    if (!patientAccount) {
      throw AppointmentError.patientAccountNotFound;
    }

    const doctorAccount = await DoctorDTO.findById(doctorId);
    if (!doctorAccount) {
      throw AppointmentError.doctorAccountNotFound;
    }

    const appointment = await AppointmentDTO.findById(appointmentId);
    if (!appointment) {
      throw AppointmentError.appointmentNotFound;
    }

    let appointmentIndex = patientAccount.appointments.indexOf(appointmentId);
    if (appointmentIndex !== -1) {
      patientAccount.appointments.splice(appointmentIndex, 1);
    } else {
      throw AppointmentError.patientAppointmentNotFound;
    }

    appointmentIndex = doctorAccount.appointments.indexOf(appointmentId);
    if (appointmentIndex !== -1) {
      doctorAccount.appointments.splice(appointmentIndex, 1);
    } else {
      throw AppointmentError.doctorAppointmentNotFound;
    }

    await patientAccount.save();
    await doctorAccount.save();
  } catch (error) {
    throw error;
  }
}
