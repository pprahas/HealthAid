
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

import mongoose, { Schema, model } from "mongoose";

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
      type: [{ type: mongoose.Schema.ObjectId, ref: "Doctor" }]
    },
    appointments: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Appointment" }]
    },
    healthInfo: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "HealthInformation" }]
    },
  },
  { timestamps: true }
);

export const PatientDTO = model("Patient", patientSchema);
