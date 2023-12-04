import { Router } from "express";
import { createPrescription } from "@endpoints/controllers/prescription/createPrescription";

class PrescriptionRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createPrescription);
  }
}

export default new PrescriptionRoutes().router;
