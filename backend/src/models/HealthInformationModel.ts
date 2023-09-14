const mongoose = require("mongoose");

const healthInformationSchema = mongoose.Schema(
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

const HealthInformation = mongoose.model(
  "HealthInformation",
  healthInformationSchema
);

module.exports = HealthInformation;
