const mongoose = require("mongoose");

const patientSchema = mongoose.Schema(
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
      type: [{ type: mongoose.Schema.ObjectId, ref: "Doctor" }],
      required: false,
    },
    appointments: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Appointment" }],
      required: false,
    },
    healthInfo: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "HealthInformation" }],
      required: false,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
