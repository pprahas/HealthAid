import { Router } from "express";
import { updatePatient } from "@endpoints/controllers/updatePatient/updatePatient";

class UpdatePatientRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", updatePatient);
  }
}

export default new UpdatePatientRoutes().router;
