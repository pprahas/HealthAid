import { AppointmentDTO } from "@models/Appointment";

export enum AppointmentError {
  appointmentNotFound = "Appointment with the given ID does not exist",
}
export async function editAppointment(appointmentId, fieldsToEdit) {
  try {
    const appointment = await AppointmentDTO.findById(appointmentId);
    if (!appointment) {
      throw AppointmentError.appointmentNotFound;
    }

    if (!fieldsToEdit || Object.keys(fieldsToEdit).length === 0) {
      throw "No information to edit";
    }

    // console.log(fieldsToEdit);

    if (fieldsToEdit) {
      for (const key in fieldsToEdit) {
        const value = fieldsToEdit[key];

        if (key === "time") {
          //   console.log("time found");
          appointment.time = value;
        }

        if (key === "title") {
          //   console.log("title found");
          appointment.title = value;
        }
      }
    }

    await appointment.save();
  } catch (error) {
    throw error;
  }
}
