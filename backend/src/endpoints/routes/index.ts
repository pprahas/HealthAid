import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import patientHealthInformationRoutes from "./healthInformation/patientHealthInformation";
import doctorHealthInformationRoutes from "./healthInformation/doctorHealthInformation";

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/patient_health_information", patientHealthInformationRoutes);
    app.use("/doctor_health_information", doctorHealthInformationRoutes);
  }
}
