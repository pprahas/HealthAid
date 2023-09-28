import { Router } from "express";
import { update_health_information } from "@endpoints/controllers/health_information/patient_health_information";

class HealthInformationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", update_health_information);
  }
}

export default new HealthInformationRoutes().router;
