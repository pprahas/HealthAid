import { AppointmentDTO } from "@models/Appointment";
import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum AppointmentError {
  accountNotFound = "An account with the given ID does not exist",
}

export async function createAppointment(patientId, doctorId, time, title) {
  try {
    const patientAccount = await PatientDTO.findById(patientId);
    if (!patientAccount) {
      throw AppointmentError.accountNotFound;
    }

    const doctorAccount = await DoctorDTO.findById(doctorId);
    if (!doctorAccount) {
      throw AppointmentError.accountNotFound;
    }

    const newAppointment = new AppointmentDTO({
      patientName: patientAccount.firstName + " " + patientAccount.lastName,
      doctorName: doctorAccount.firstName + " " + doctorAccount.lastName,
      time: time,
      title: title,
    });

    patientAccount.appointments.push(newAppointment._id);
    doctorAccount.appointments.push(newAppointment._id);

    await patientAccount.save();
    await doctorAccount.save();
    await newAppointment.save();
  } catch (error) {
    throw error;
  }
}
