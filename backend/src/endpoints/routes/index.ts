import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import patientHealthInformationRoutes from "./healthInformation/patientHealthInformation";

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/patient_health_information", patientHealthInformationRoutes);
  }
}
