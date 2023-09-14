import mongoose, { Schema, model } from "mongoose";

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
      type: mongoose.Schema.ObjectId,
      ref: "Clinic",
      required: false,
    },
    appointments: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Appointment" }],
      required: false,
    },
    patients: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Patient" }],
      required: false,
    },
  },
  { timestamps: true }
);

export const Doctor = model("Doctor", doctorSchema);
