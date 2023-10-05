import { Schema, model, ObjectId } from "mongoose";

export type Doctor = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday?: Date;
  clinic?: typeof Schema.ObjectId;
  appointments?: [ObjectId];
  patients?: [ObjectId];
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
