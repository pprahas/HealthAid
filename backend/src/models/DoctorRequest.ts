import { Schema, model } from "mongoose";

// Local Model
export interface DoctorRequest {
  doctorEmail: String;
  diploma: Buffer;
  npi: string;
};

export const doctorRequestSchema = new Schema(
  {
    doctorEmail: {
      type: String,
      required: true,
    },
    diploma: {
      type: Buffer,
      required: true,
    },
    npi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Database Model
export const DoctorRequestDTO = model("DoctorRequest", doctorRequestSchema);
