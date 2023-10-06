import { Router } from "express";
import { getPatientByIdController } from "@endpoints/controllers/patient/getPatientById";

class getPatientById {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getPatientByIdController);
  }
}

export default new getPatientById().router;
