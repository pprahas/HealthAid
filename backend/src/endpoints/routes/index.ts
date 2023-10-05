import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import resetPasswordRoutes from "./authentication/resetPassword";
import getPatient from "./patient/getPatient";
import getDoctorById from "./doctor/getDoctorById";

import patientHealthInformationRoutes from "./extraInformation/patientHealthInformation";
import doctorClinicInformationRoutes from "./extraInformation/doctorClinicInformation";
import conversationRoutes from "./conversation/conversation";
export default class Routes {
  constructor(app: Application) {
    app.use("/resetPassword", resetPasswordRoutes);
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/getPatientByEmail", getPatient)
    app.use("/getDoctorFromId", getDoctorById)
    app.use("/patientHealthInformation", patientHealthInformationRoutes);
    app.use("/doctorClinicInformation", doctorClinicInformationRoutes);
    app.use("/conversation", conversationRoutes);
  }
}
