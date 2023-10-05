import { Schema, model } from "mongoose";

export type Patient = {
  date: Date;
  nam: string;
  expirationDate: Date;
  remainingRefills?: Number;
}

const prescriptionSchema = new Schema(
  {
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