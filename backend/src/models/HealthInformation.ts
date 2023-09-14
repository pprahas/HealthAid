import { Schema, model } from "mongoose";

export type HealthInformation = {
  question: string;
  answer: string;
}

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

export const HealthInformationDTO = model(
  "HealthInformation",
  healthInformationSchema
);