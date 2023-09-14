const mongoose = require("mongoose");

const prescriptionSchema = mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    remainingRefills: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
