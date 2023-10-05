import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import getPatient from "./patient/getPatient";
import getDoctorById from "./doctor/getDoctorById";

import patientHealthInformationRoutes from "./extraInformation/patientHealthInformation";
import doctorClinicInformationRoutes from "./extraInformation/doctorClinicInformation";
import conversationRoutes from "./conversation/conversation";
import updatePatientRoutes from "./updatePatient/updatePatient";
export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/getPatientByEmail", getPatient)
    app.use("/getDoctorFromId", getDoctorById)
    app.use("/patientHealthInformation", patientHealthInformationRoutes);
    app.use("/doctorClinicInformation", doctorClinicInformationRoutes);
    app.use("/conversation", conversationRoutes);
    app.use("/updatePatient", updatePatientRoutes);
  }
}
