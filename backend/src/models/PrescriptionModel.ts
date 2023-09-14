import { Schema, model } from "mongoose";

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

export const Prescription = model("Prescription", prescriptionSchema);