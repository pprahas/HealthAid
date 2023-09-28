import { Router } from "express";
import { updateHealthInformation } from "@endpoints/controllers/healthInformation/patientHealthInformation";

class HealthInformationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", updateHealthInformation);
  }
}

export default new HealthInformationRoutes().router;
