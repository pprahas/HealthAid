import { Schema, model } from "mongoose";

// Local Model
export type Patient = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday?: Date;
  gender?: string;
  weight?: Number;
  height?: Number;
  bio?: string;
  doctors?: [any?];
  appointments?: [any?];
  healthInfo?: [any?];
}

export const patientSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    birthday: {
      type: Date
    },
    gender: {
      type: String
    },
    weight: {
      type: Number
    },
    height: {
      type: Number
    },
    bio: {
      type: String
    },
    doctors: {
      type: [{ type: Schema.ObjectId, ref: "Doctor" }]
    },
    appointments: {
      type: [{ type: Schema.ObjectId, ref: "Appointment" }]
    },
    healthInfo: {
      type: [{ type: Schema.ObjectId, ref: "HealthInformation" }]
    },
  },
  { timestamps: true }
);

// Database Model
export const PatientDTO = model("Patient", patientSchema);