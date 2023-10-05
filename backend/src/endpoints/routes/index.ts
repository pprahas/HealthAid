import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import patientHealthInformationRoutes from "./healthInformation/patientHealthInformation";
import getPatient from "./patient/getPatient";
import getDoctorById from "./doctor/getDoctorById";

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/patient_health_information", patientHealthInformationRoutes);
    app.use("/getPatientByEmail", getPatient)
    app.use("/getDoctorFromId", getDoctorById)
  }
}
