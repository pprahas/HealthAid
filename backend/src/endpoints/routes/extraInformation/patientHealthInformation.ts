import { Router } from "express";
import { updateHealthInformation, getHealthInformation } from "@endpoints/controllers/extraInformation/patientHealthInformation";

class HealthInformationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", updateHealthInformation);
    this.router.post("/getHealthInformation", getHealthInformation);
  }
}

export default new HealthInformationRoutes().router;
