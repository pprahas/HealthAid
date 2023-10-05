import { Schema, model } from "mongoose";
import { Doctor } from "./Doctor";
import { Appointment } from "./Appointment";
import { HealthInformation } from "./HealthInformation";

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
  doctors?: [Doctor];
  appointments?: [Appointment];
  healthInfo?: [HealthInformation];
};

export const patientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    bio: {
      type: String,
    },
    doctors: {
      type: [{ type: Schema.ObjectId, ref: "Doctor" }],
    },
    appointments: {
      type: [{ type: Schema.ObjectId, ref: "Appointment" }],
    },
    healthInfo: {
      type: [{ type: Schema.ObjectId, ref: "HealthInformation" }],
    },
  },
  { timestamps: true }
);

// Database Model
export const PatientDTO = model("Patient", patientSchema);
