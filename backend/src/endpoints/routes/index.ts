import { Application } from "express";
import registerRoutes from "./authentication/register";
import gptRoutes from "../../openai/index";
export default class Routes {
  constructor(app: Application) {
    app.use("/register", registerRoutes);
    app.use("/gpt", gptRoutes);
  }
}
