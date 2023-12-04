import { Schema, model } from "mongoose";

export type Prescription = {
  date: Date;
  name: string;
  reminderCycle: string;
  expirationDate: Date;
  remainingRefills?: Number;
};

const prescriptionSchema = new Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    reminderCycle: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    remainingRefills: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export const PrescriptionDTO = model("Prescription", prescriptionSchema);
