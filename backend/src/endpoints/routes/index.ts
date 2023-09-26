import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
  }
}
