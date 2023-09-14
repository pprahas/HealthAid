import { Schema, model } from "mongoose";

export type Clinic = {
  clinicId: string;
  name: string;
  address: string;
  website: string;
  phoneNumber: string;
}

const clinicSchema = new Schema(
  {
    clinicId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const ClinicDTO = model("Clinic", clinicSchema);