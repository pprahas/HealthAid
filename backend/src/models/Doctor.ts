import { Schema, model, ObjectId } from "mongoose";
import { Appointment } from "./Appointment";
import { Patient } from "./Patient";
import { Clinic } from "./Clinic";

export type Doctor = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: String,
  birthday?: Date;
  clinic?: (typeof Schema.ObjectId | Clinic);
  appointments?: [Appointment];
  patients?: [Patient];
};

const doctorSchema = new Schema(
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
    userType: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: false,
    },
    clinic: {
      type: Schema.ObjectId,
      ref: "Clinic",
      required: false,
    },
    appointments: {
      type: [{ type: Schema.ObjectId, ref: "Appointment" }],
      required: false,
    },
    patients: {
      type: [{ type: Schema.ObjectId, ref: "Patient" }],
      required: false,
    },
  },
  { timestamps: true }
);

export const DoctorDTO = model("Doctor", doctorSchema);
