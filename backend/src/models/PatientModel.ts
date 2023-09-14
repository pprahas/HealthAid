import { Schema, model } from "mongoose";

const patientSchema = new Schema(
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
    gender: {
      type: String,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    doctors: {
      type: [{ type: new Schema.ObjectId, ref: "Doctor" }],
      required: false,
    },
    appointments: {
      type: [{ type: new Schema.ObjectId, ref: "Appointment" }],
      required: false,
    },
    healthInfo: {
      type: [{ type: new Schema.ObjectId, ref: "HealthInformation" }],
      required: false,
    },
  },
  { timestamps: true }
);

const Patient = model("Patient", patientSchema);

module.exports = Patient;
