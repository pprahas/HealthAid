const mongoose = require("mongoose");

const diagnosisSchema = mongoose.Schema(
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

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
