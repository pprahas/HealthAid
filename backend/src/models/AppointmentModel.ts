import { Schema, model } from "mongoose";

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

export const Appointment = model("Appointment", appointmentSchema);
