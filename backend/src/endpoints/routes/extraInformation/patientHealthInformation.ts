import { Router } from "express";
import { updateHealthInformation } from "@endpoints/controllers/extraInformation/patientHealthInformation";

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
