import { Router } from "express";
import { createClinicInformation } from "@endpoints/controllers/extraInformation/doctorClinicInformation";

class ClinicInformationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", createClinicInformation);
  }
}

export default new ClinicInformationRoutes().router;
