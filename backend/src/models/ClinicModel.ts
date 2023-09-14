import { Schema, model } from "mongoose";

const clinicSchema = new Schema(
  {
    clinicId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
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
  },
  { timestamps: true }
);

const Clinic = model("Clinic", clinicSchema);

module.exports = Clinic;
