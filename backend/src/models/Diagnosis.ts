import { Schema, model } from "mongoose";

export type Diagnosis = {
  diagnosisId: string;
  isReviewed: Boolean;
  dateReviewed: Date;
  content: string;
  prescriptions?: [typeof Schema.ObjectId]
}

const diagnosisSchema = new Schema(
  {
    diagnosisId: {
      type: String,
      required: true,
    },
    isReviewed: {
      type: Boolean,
      required: true,
    },
    dateReviewed: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    prescriptions: {
      type: [{ type: Schema.ObjectId, ref: "Prescription" }],
      required: false,
    },
  },
  { timestamps: true }
);

export const DiagnosisDTO = model("Diagnosis", diagnosisSchema);