import { Schema, model } from "mongoose";

export type Clinic = {
  name: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  specialties: string;
  network: string;
};

const clinicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    specialties: {
      type: String,
    },
    address: {
      type: String,
    },
    network: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ClinicDTO = model("Clinic", clinicSchema);
