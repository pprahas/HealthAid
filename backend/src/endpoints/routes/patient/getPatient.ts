import { Router } from "express";
import { getPatientByEmail } from "@endpoints/controllers/patient/getPatient";

class GetPatientByEmail {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getPatientByEmail);
  }
}

export default new GetPatientByEmail().router;
