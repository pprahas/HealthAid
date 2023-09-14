import { Schema, model } from "mongoose";

const healthInformationSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const HealthInformation = model(
  "HealthInformation",
  healthInformationSchema
);