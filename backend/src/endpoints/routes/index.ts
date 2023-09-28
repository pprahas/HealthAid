import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import healthInformationRoutes from "./health_information/health_information";

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/health_information", healthInformationRoutes);
  }
}
