import { Router } from "express";
import { registerDoctor, registerPatient } from "@endpoints/controllers/authentication/register";

class RegisterRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/patient", registerPatient);
    this.router.post("/doctor", registerDoctor);
  }
}

export default new RegisterRoutes().router;
