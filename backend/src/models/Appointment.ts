import { Schema, model } from "mongoose";

export type Appointment = {
  appointmentId: string;
  doctorName: string;
  patientName: string;
  date: Date;
}

const appointmentSchema = new Schema(
  {
    appointmentId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const AppointmentDTO = model("Appointment", appointmentSchema);
