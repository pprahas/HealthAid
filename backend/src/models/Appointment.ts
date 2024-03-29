import { Schema, model } from "mongoose";

export type Appointment = {
  doctorName: string;
  patientName: string;
  date: Date;
  title: String;
};

const appointmentSchema = new Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    doctorId: {
      type: Schema.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: Schema.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true }
);

export const AppointmentDTO = model("Appointment", appointmentSchema);