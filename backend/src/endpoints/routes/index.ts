import { Application } from "express";
import registerRoutes from "./authentication/register"

export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
  }
}