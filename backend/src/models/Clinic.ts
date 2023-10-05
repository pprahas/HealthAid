import { Schema, model } from "mongoose";

export type Clinic = {
  name: string;
  address: string;
  website: string;
  phoneNumber: string;
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
      type: Date,
      required: true,
    },
    specialties: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const ClinicDTO = model("Clinic", clinicSchema);
