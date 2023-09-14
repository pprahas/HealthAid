const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
