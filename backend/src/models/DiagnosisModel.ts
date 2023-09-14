import mongoose, { Schema, model } from "mongoose";

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
      type: [{ type: mongoose.Schema.ObjectId, ref: "Prescription" }],
      required: false,
    },
  },
  { timestamps: true }
);

const Diagnosis = model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
