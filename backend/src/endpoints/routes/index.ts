import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import patientHealthInformationRoutes from "./healthInformation/patientHealthInformation";
import conversationRoutes from "./conversation/conversation";
export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/patient_health_information", patientHealthInformationRoutes);
    app.use("/conversation", conversationRoutes);
  }
}
