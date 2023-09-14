import { Schema, model } from "mongoose";

export type Patient = {
  prescriptionId: string;
  date: Date;
  nam: string;
  expirationDate: Date;
  remainingRefills?: Number;
}

const prescriptionSchema = new Schema(
  {
    prescriptionId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
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